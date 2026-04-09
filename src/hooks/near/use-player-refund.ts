import { useState } from "react";
import { getNonce, getProvider } from "./util";
import { transactions } from "near-api-js";
import { PublicKey } from "near-api-js/lib/utils/key_pair";
import { functionCall } from "near-api-js/lib/transaction";
import { base_decode } from "near-api-js/lib/utils/serialize";
import useGenerateKey from "@/hooks/near/use-generate-key";
import useToast from "@/hooks/use-toast";
import reportHash from "@/utils/report-hash";
import { useAuth } from '@/contexts/wallet'
import useCancelledPoolsStore from "@/stores/use-cancelled-pools";

const THIRTY_TGAS = "300000000000000";

export default function usePlayerRefund(
  poolId?: string,
  onSuccess?: () => void
) {
  const [loading, setLoading] = useState(false);
  const { generateKeyPair } = useGenerateKey();
  const toast = useToast();
  const { address } = useAuth();
  const cancelledPoolsStore = useCancelledPoolsStore();

  async function refund() {
    const { publicKey, keyPairSigner } = await generateKeyPair();
    if (!publicKey || !keyPairSigner || !poolId) return
    let toastId = toast.loading({ title: 'Claiming...' })
    try {
      setLoading(true);

      const provider = getProvider();
      const { header } = await provider.block({ finality: "final" });

      const refundArgs = {
        game_args: {
          ByAk: {
            game_id: Number(poolId)
          }
        }
      };
      console.log("refundArgs:", JSON.stringify(refundArgs));
      const nonce = await getNonce(publicKey);
      const publicKeyObj = PublicKey.from(publicKey);

      const transaction = transactions.createTransaction(
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        publicKeyObj,
        import.meta.env.VITE_NEAR_ACCOUNT_ID,
        nonce,
        [
          functionCall("refund_bet", refundArgs, BigInt(THIRTY_TGAS), BigInt(0))
        ],
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
        console.log("Claim success:", result);
        toast.success({ title: "Claim success" });
        onSuccess?.();
        cancelledPoolsStore.removeCancelledPool(poolId);
      } else {
        toast.dismiss(toastId);
        console.log("Claim failed:", result);
        toast.fail({ title: "Claim failed" });
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.fail({ title: "Claim failed" });
      console.error("Claim error:", error);
    } finally {
      setLoading(false);
    }
  }

  return {
    refund,
    loading
  };
}
