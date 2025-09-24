import { useMemo, useState } from "react";
import { getNonce, getProvider, quote } from "./util";
import { KeyPairSigner, transactions } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils/key_pair";
import { functionCall } from "near-api-js/lib/transaction";
import { base_decode } from "near-api-js/lib/utils/serialize";
import { useNearKeyStore } from "@/stores/use-near-key";
import Big from "big.js";
import dayjs from "dayjs";
const THIRTY_TGAS = "300000000000000";

export default function useWithdraw() {
  const [loading, setLoading] = useState(false);
  const { publicKey, privateKey } = useNearKeyStore();

  const keyPairSigner = useMemo(() => {
    if (!privateKey) {
      return null;
    }
    return KeyPairSigner.fromSecretKey(("ed25519:" + privateKey) as any);
  }, [privateKey]);

  async function withdraw({
    fromToken,
    toToken,
    account,
    amount
  }: {
    fromToken: any;
    toToken: any;
    account: string;
    amount: string;
  }) {
    try {
      setLoading(true);

      if (!publicKey || !privateKey) {
        throw new Error(
          "Public key or private key is missing. Please generate key pair first."
        );
      }

      if (!keyPairSigner) {
        throw new Error(
          "KeyPairSigner is not available. Please generate key pair first."
        );
      }

      const provider = getProvider();
      const { header } = await provider.block({ finality: "final" });
      const _amount = Big(amount)
        .mul(10 ** fromToken.decimals)
        .toFixed(0);
      const res = await quote({
        dry: false,
        swapType: "EXACT_INPUT",
        slippageTolerance: 50,
        originAsset: fromToken.assetId,
        depositType: "ORIGIN_CHAIN",
        destinationAsset: toToken.assetId,
        amount: _amount,
        refundTo: import.meta.env.VITE_NEAR_ACCOUNT_ID,
        refundType: "ORIGIN_CHAIN",
        recipient: account,
        recipientType: "DESTINATION_CHAIN",
        deadline: dayjs().add(1, "hour").toISOString()
      });

      const recipientAccount = res.quote.depositAddress;

      const withdrawArgs = {
        withdraw_args: {
          ByAk: {
            amount: _amount,
            token: { FT: fromToken.address },
            recipient_account: recipientAccount
          }
        }
      };
      console.log("withdrawArgs:", JSON.stringify(withdrawArgs));
      const nonce = await getNonce(publicKey);
      const publicKeyObj = PublicKey.from(publicKey);

      const transaction = transactions.createTransaction(
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        publicKeyObj,
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        nonce,
        [
          functionCall("withdraw", withdrawArgs, BigInt(THIRTY_TGAS), BigInt(0))
        ],
        base_decode(header.hash)
      );

      const [, signedTransaction] = await keyPairSigner.signTransaction(
        transaction
      );
      console.log("signedTransaction:", signedTransaction);
      const result: any = await provider.sendTransaction(signedTransaction);

      if (result.status.SuccessValue) {
        console.log("Withdraw success:", result);
      } else {
        console.log("Withdraw failed:", result);
      }
    } catch (error) {
      console.error("Withdraw error:", error);
    } finally {
      setLoading(false);
    }
  }

  return {
    withdraw,
    loading
  };
}
