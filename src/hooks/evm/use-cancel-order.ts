import { useState } from "react";
import useBettingContract from "@/hooks/evm/use-betting-contract";
import useToast from "@/hooks/use-toast";
import reportHash from "@/utils/report-hash";
import useGelatonetwork from "./use-gelatonetwork";

export default function useCancelOrder({
  onCancelSuccess
}: {
  onCancelSuccess: () => void;
}) {
  const [canceling, setCancelling] = useState(false);
  const BettingContract = useBettingContract();
  const toast = useToast();
  const { executeTransaction } = useGelatonetwork();
  const cancelOrder = async (poolId: number) => {
    if (!BettingContract) {
      return;
    }
    try {
      setCancelling(true);
      const tx = await BettingContract.populateTransaction.cancelActivity(
        poolId
      );
      executeTransaction({
        calls: [tx],
        onSuccess: async (receipt: any) => {
          setCancelling(false);
          if (receipt?.status === 0) {
            toast.fail({ title: "Cancel order failed" });
          } else {
            toast.success({ title: "Cancel order success" });
            onCancelSuccess();
          }

          reportHash({
            hash: receipt.transactionHash,
            block_number: receipt.blockNumber,
            chain: "Berachain",
            user: receipt?.from
          });
        },
        onError: () => {
          setCancelling(false);
          toast.fail({ title: "Cancel order failed" });
        }
      });
    } catch (error) {
      console.error("Cancel error:", error);
      toast.fail({ title: "Cancel order failed" });
      setCancelling(false);
    }
  };

  return { canceling, onCancel: cancelOrder };
}
