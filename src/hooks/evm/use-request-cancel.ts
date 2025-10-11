import { useState } from "react";
import useBettingContract from "./use-betting-contract";
import useToast from "@/hooks/use-toast";
import useGelatonetwork from "./use-gelatonetwork";
import reportHash from "@/utils/report-hash";

// for user locking pool

export default function useRequestCancel({
  onCancelSuccess
}: {
  onCancelSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const BettingContract = useBettingContract();
  const { executeTransaction } = useGelatonetwork();
  const lock = async (poolId: number) => {
    if (!BettingContract) {
      return;
    }

    try {
      setLoading(true);
      const tx = await BettingContract.populateTransaction.requestCancel(
        poolId
      );

      const estimateGas = await BettingContract.estimateGas.requestCancel(
        poolId
      );
      console.log("estimateGas", estimateGas.toString());

      executeTransaction({
        calls: [tx],
        onSuccess: (receipt: any) => {
          setLoading(false);

          if (receipt?.status === 0) {
            toast.fail({ title: "Request cancel failed" });
            return;
          } else {
            toast.success({ title: "Request cancel success" });
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
          toast.fail({ title: "Request cancel failed" });
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Request cancel error:", error);
      toast.fail({ title: "Request cancel failed" });
      setLoading(false);
    }
  };

  return { loading, onMarkCancel: lock };
}
