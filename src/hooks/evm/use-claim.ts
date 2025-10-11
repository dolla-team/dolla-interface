import { useState } from "react";
import useBettingContract from "./use-betting-contract";
import useToast from "@/hooks/use-toast";
import useGelatonetwork from "./use-gelatonetwork";
import reportHash from "@/utils/report-hash";

// for seller claiming

export default function useClaim(poolIds: number[], onSuccess?: () => void) {
  const [claiming, setClaiming] = useState(false);
  const toast = useToast();
  const BettingContract = useBettingContract();
  const { executeTransaction } = useGelatonetwork();
  const claim = async () => {
    if (!BettingContract) {
      return;
    }
    try {
      setClaiming(true);
      const _poolIds = Array.isArray(poolIds) ? poolIds : [poolIds];
      const tx =
        await BettingContract.populateTransaction.batchExtractCreatorFunds(
          _poolIds
        );
      executeTransaction({
        calls: [tx],
        onSuccess: (receipt: any) => {
          console.log("receipt", receipt);
          setClaiming(false);

          if (receipt?.status === 0) {
            toast.fail({ title: "Claim failed" });
          } else {
            toast.success({ title: "Claim success" });
            onSuccess?.();
          }
          reportHash({
            hash: receipt.transactionHash,
            block_number: receipt.blockNumber,
            chain: "Berachain",
            user: receipt?.from
          });
        },
        onError: () => {
          toast.fail({ title: "Claim failed" });
          setClaiming(false);
          throw new Error("Claim failed");
        }
      });
    } catch (error) {
      console.error("Claim error:", error);
      setClaiming(false);
      toast.fail({ title: "Claim failed" });
      throw error;
    }
  };

  return { claiming, claim };
}
