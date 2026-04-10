import { useState } from "react";
import { getNonce, getProvider } from "./util";
import { transactions } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils/key_pair";
import { functionCall } from "near-api-js/lib/transaction";
import { base_decode } from "near-api-js/lib/utils/serialize";
import useGenerateKey from "@/hooks/near/use-generate-key";
import useToast from "@/hooks/use-toast";
import { QUOTE_TOKEN } from "@/config/btc";
import { useAuth } from '@/contexts/wallet'
import { BET_UNIT } from "@/config";
import Big from "big.js";
import reportHash from "@/utils/report-hash";

const THIRTY_TGAS = "300000000000000";

export default function useBuyTicket(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const { generateKeyPair } = useGenerateKey();
  const { updateNearAccount, address, chainType } = useAuth();
  const toast = useToast();

  async function transfer(ticket: number) {
    const { publicKey, keyPairSigner } = await generateKeyPair();
    if (!publicKey || !keyPairSigner) return;

    let toastId = toast.loading({ title: "Buying ticket..." });
    try {
      setLoading(true);

      const provider = getProvider();
      const { header } = await provider.block({ finality: "final" });

      const args = {
        transfer_args: {
          ByAk: {
            amount: Big(ticket).mul(BET_UNIT).toFixed(0),
            // amount: "1000",
            token: { FT: QUOTE_TOKEN.address },
            recipient: {
              // Evm: "43fe6fcbc6eb7d4735589d2c2951d366d968fe75"
              // Evm: "9e80a8e261d2ac69777d854b21592729d6766709"
              Evm: "d0f9da85ca8dbc1586067c659280084036913766"
            },
            as_gift: false
          }
        },
        memo: JSON.stringify({
          type: "dolla_buy_ticket",
          address: address,
          address_chain: chainType
        })
      };

      const nonce = await getNonce(publicKey);
      const publicKeyObj = PublicKey.from(publicKey);

      const transaction = transactions.createTransaction(
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        publicKeyObj,
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        nonce,
        [functionCall("inner_transfer", args, BigInt(THIRTY_TGAS), BigInt(0))],
        base_decode(header.hash)
      );

      const [, signedTransaction] = await keyPairSigner.signTransaction(
        transaction
      );
      console.log("signedTransaction:", signedTransaction);
      const result: any = await provider.sendTransaction(signedTransaction);

      reportHash({
        hash: result.transaction.hash,
        chain: "near",
        user: address
      });
      if (result.status.SuccessValue) {
        toast.dismiss(toastId);
        console.log("Transfer success:", result);
        toast.success({ title: "Buy ticket success" });
        updateNearAccount();
        onSuccess?.();
      } else {
        toast.dismiss(toastId);
        console.log("Transfer failed:", result);
        toast.fail({ title: "Buy ticket failed" });
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.fail({ title: "Buy ticket failed" });
      console.error("Transfer error:", error);
    } finally {
      setLoading(false);
    }
  }

  return {
    transfer,
    loading
  };
}
