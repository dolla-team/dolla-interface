import { useState } from "react";
import { getNonce, getProvider } from "./util";
import { transactions } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils/key_pair";
import { functionCall } from "near-api-js/lib/transaction";
import { base_decode } from "near-api-js/lib/utils/serialize";
import useGenerateKey from "@/hooks/near/use-generate-key";
import Big from "big.js";
import useToast from "@/hooks/use-toast";
import useReport from "../transaction/use-report";

const THIRTY_TGAS = "300000000000000";

export default function useWithdraw(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const { generateKeyPair } = useGenerateKey();
  const { report } = useReport();

  const toast = useToast();

  async function withdraw({
    fromToken,
    amount,
    recipientAccount = "",
    isMax = false
  }: {
    fromToken: any;
    amount: string;
    recipientAccount?: string;
    isMax?: boolean;
  }) {
    const { publicKey, keyPairSigner } = await generateKeyPair();
    if (!publicKey) return;
    let toastId = toast.loading({ title: "Withdrawing..." });
    try {
      setLoading(true);

      const provider = getProvider();
      const { header } = await provider.block({ finality: "final" });
      const _amount = Big(amount)
        .mul(10 ** fromToken.decimals)
        .toFixed(0);

      // if (type === "token") {
      //   const res = await quote({
      //     dry: false,
      //     swapType: "EXACT_INPUT",
      //     slippageTolerance: 50,
      //     originAsset: fromToken.assetId,
      //     depositType: "ORIGIN_CHAIN",
      //     destinationAsset: toToken.assetId,
      //     amount: _amount,
      //     refundTo: import.meta.env.VITE_NEAR_ACCOUNT_ID,
      //     refundType: "ORIGIN_CHAIN",
      //     recipient: account,
      //     recipientType: "DESTINATION_CHAIN",
      //     deadline: dayjs().add(1, "hour").toISOString()
      //   });

      //   recipientAccount = res.quote.depositAddress;
      // } else {
      //   // Remove 0x prefix and pad to 64 characters with leading zeros
      //   recipientAccount = account.startsWith("0x")
      //     ? account.slice(2)
      //     : account;
      //   recipientAccount = recipientAccount.padStart(64, "0");
      // }

      const _args: any = {
        token: { FT: fromToken.address },
        recipient_account: recipientAccount
      };

      if (!isMax) {
        _args.amount = _amount;
      }

      const withdrawArgs = {
        withdraw_args: {
          ByAk: _args
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
      toast.dismiss(toastId);
      report({
        address: recipientAccount,
        type: "withdraw"
      });
      if (result.status.SuccessValue !== undefined) {
        console.log("Withdraw success:", result);
        toast.success({ title: "Withdraw success" });
        onSuccess?.();
      } else {
        console.log("Withdraw failed:", result);
        toast.fail({ title: "Withdraw failed" });
      }
      setLoading(false);
    } catch (error) {
      console.error("Withdraw error:", error);
      toast.dismiss(toastId);
      toast.fail({ title: "Withdraw failed" });
      setLoading(false);
    }
  }

  return {
    withdraw,
    loading
  };
}
