import useToast from "../use-toast";
import { useState } from "react";
import { ethers } from "ethers";
import useBettingContract from "./use-betting-contract";
import reportHash from "@/utils/report-hash";
import useGelatonetwork from "./use-gelatonetwork";

export default function useDraw(
  onSuccess: (isWinner: boolean) => void,
  onError: () => void
) {
  const [drawing, setDrawing] = useState(false);
  const toast = useToast();
  const BettingContract = useBettingContract();
  const { executeTransaction } = useGelatonetwork();

  const onDraw = async (poolId: number, times: number) => {
    if (poolId === -1 || !BettingContract) {
      return;
    }
    setDrawing(true);
    try {
      const poolState = await BettingContract.getPoolState(poolId);
      const poolConfig = await BettingContract.poolConfigs(poolId);
      console.log("poolConfig", poolId, poolConfig);
      console.log("poolState", poolState);
      if (poolState.winner !== "0x0000000000000000000000000000000000000000") {
        toast.fail({ title: "Pool is already drawn" });
        setDrawing(false);
        return;
      }
      const flipFee = await BettingContract.getFlipFee();
      console.log("flipFee", flipFee);
      const method = times > 1 ? "drawMultiple" : "drawOnce";
      const userRandomNumber = ethers.utils.hexlify(
        ethers.utils.randomBytes(32)
      );
      const params =
        times > 1
          ? [poolId, times, userRandomNumber]
          : [poolId, userRandomNumber];

      const tx = await BettingContract.populateTransaction[method](...params, {
        value: flipFee
      });
      executeTransaction({
        calls: [tx],
        onSuccess: async (receipt: any) => {
          setDrawing(false);

          if (receipt?.status === 1) {
            const afterPoolState = await BettingContract.getPoolState(poolId);
            console.log("afterPoolState", afterPoolState);
            onSuccess(
              afterPoolState.winner !==
                "0x0000000000000000000000000000000000000000"
            );
            toast.success({
              title:
                afterPoolState.winner !==
                "0x0000000000000000000000000000000000000000"
                  ? "You are the winner"
                  : "Draw success"
            });
            setDrawing(false);
          } else {
            toast.fail({ title: "Bid failed" });
          }
          reportHash({
            hash: receipt.transactionHash,
            block_number: receipt.blockNumber,
            chain: "Berachain",
            user: receipt.from
          });
        },
        onError: (status: any) => {
          console.log("onError", status);
          setDrawing(false);
          toast.fail({ title: "Bid failed" });
          onError();
        }
      });
    } catch (error) {
      setDrawing(false);
      console.error(error);
    }
  };
  return {
    drawing,
    onDraw
  };
}
