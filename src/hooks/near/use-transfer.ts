import { useState } from "react";
import { getNonce, getProvider } from "./util";
import { transactions } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils/key_pair";
import { functionCall } from "near-api-js/lib/transaction";
import { base_decode } from "near-api-js/lib/utils/serialize";
import useGenerateKey from "@/hooks/near/use-generate-key";
import useToast from "@/hooks/use-toast";
import { QUOTE_TOKEN } from "@/config/btc";
import { useAuth } from "@/contexts/auth";
import { BET_UNIT } from "@/config";
import Big from "big.js";

const THIRTY_TGAS = "300000000000000";

export default function useTransfer(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const { generateKeyPair } = useGenerateKey();
  const { address, updateNearAccount } = useAuth();
  const toast = useToast();

  async function transfer(ticket: number) {
    let toastId = toast.loading({ title: "Buying ticket..." });
    try {
      setLoading(true);

      const { publicKey, keyPairSigner } = await generateKeyPair();

      const provider = getProvider();
      const { header } = await provider.block({ finality: "final" });

      const args = {
        transfer_args: {
          ByAk: {
            amount: Big(ticket).mul(BET_UNIT).toFixed(0),
            token: { FT: QUOTE_TOKEN.address },
            recipient: {
              Evm: address.slice(2).toLowerCase()
            },
            as_gift: false
          }
        }
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
