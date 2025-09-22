import { useState } from "react";
import Big from "big.js";
import useToast from "@/hooks/use-toast";
import useBettingContract from "./use-betting-contract";
import reportHash from "@/utils/report-hash";
import useGelatonetwork from "./use-gelatonetwork";
import { BET_UNIT } from "@/config";

export default function useCreate({
  token,
  price,
  onCreateSuccess
}: {
  token: any;
  price: number;
  onCreateSuccess?: (poolId: number) => void;
}) {
  const [creating, setCreating] = useState(false);
  const toast = useToast();
  const BettingContract = useBettingContract();
  const { executeTransaction } = useGelatonetwork();

  const onCreate = async () => {
    if (!BettingContract) {
      return;
    }
    try {
      setCreating(true);

      const tx =
        await BettingContract.populateTransaction.sendCrossChainMessage(
          token.address,
          BET_UNIT,
          Big(price * 10 ** 6).toFixed(0),
          token.id // nftIds
        );
      executeTransaction({
        calls: [tx],
        onSuccess: async (receipt: any) => {
          console.log("success", receipt);
          setCreating(false);

          if (receipt?.status === 0) {
            toast.fail({ title: "Create pool failed" });
          } else {
            const poolId = receipt.logs[0].topics[1];
            console.log("poolId", poolId);
            onCreateSuccess?.(Number(poolId));
            toast.success({ title: "Create pool success" });
          }

          reportHash({
            hash: receipt.transactionHash,
            block_number: receipt.blockNumber,
            chain: "Berachain",
            user: receipt?.from
          });
        },
        onError: (status: any) => {
          console.log("onError", status);
          setCreating(false);
          toast.fail({ title: "Create pool failed" });
        }
      });
    } catch (error) {
      console.error("Create error:", error);
      toast.fail({ title: "Create pool failed" });
      setCreating(false);
    }
  };

  return {
    creating,
    onCreate
  };
}
