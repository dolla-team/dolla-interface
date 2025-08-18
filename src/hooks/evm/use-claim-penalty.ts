import { useState } from "react";
import useBettingContract from "./use-betting-contract";
import useToast from "@/hooks/use-toast";
import useGelatonetwork from "./use-gelatonetwork";
import reportHash from "@/utils/report-hash";

// for user claiming penalty

export default function useClaimPenalty(onSuccess: any) {
  const [claiming, setClaiming] = useState(false);
  const toast = useToast();
  const BettingContract = useBettingContract();
  const { executeTransaction } = useGelatonetwork();
  const claim = async (poolId: number) => {
    if (!BettingContract) {
      return;
    }
    try {
      setClaiming(true);
      const tx = await BettingContract.populateTransaction.claimPenalty(poolId);

      executeTransaction({
        calls: [tx],
        onSuccess: (receipt: any) => {
          setClaiming(false);

          if (receipt?.status === 0) {
            toast.fail({ title: "Claim failed" });
            return;
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
        }
      });
    } catch (error) {
      console.error("Claim error:", error);
      toast.fail({ title: "Claim failed" });
      setClaiming(false);
    }
  };

  return { claiming, claim };
}
