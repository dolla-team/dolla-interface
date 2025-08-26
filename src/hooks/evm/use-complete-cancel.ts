import { useState } from "react";
import useBettingContract from "./use-betting-contract";
import useToast from "@/hooks/use-toast";
import useGelatonetwork from "./use-gelatonetwork";
import reportHash from "@/utils/report-hash";

// for user unlocking pool

export default function useCompleteCancel({
  onCancelSuccess
}: {
  onCancelSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const BettingContract = useBettingContract();
  const { executeTransaction } = useGelatonetwork();
  const unlock = async (poolId: number) => {
    if (!BettingContract) {
      return;
    }
    try {
      setLoading(true);
      const tx = await BettingContract.populateTransaction.completeCancel(
        poolId
      );

      executeTransaction({
        calls: [tx],
        onSuccess: (receipt: any) => {
          setLoading(false);

          if (receipt?.status === 0) {
            toast.fail({ title: "Cancel pool failed" });
            return;
          } else {
            toast.success({ title: "Cancel pool success" });
            onCancelSuccess?.();
          }

          reportHash({
            hash: receipt.transactionHash,
            block_number: receipt.blockNumber,
            chain: "Berachain",
            user: receipt?.from
          });
        },
        onError: () => {
          toast.fail({ title: "Cancel pool failed" });
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Cancel pool error:", error);
      toast.fail({ title: "Cancel pool failed" });
      setLoading(false);
    }
  };

  return { loading, onRevertCancel: unlock };
}
