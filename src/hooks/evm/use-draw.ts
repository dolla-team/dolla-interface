import useToast from "../use-toast";
import { useState } from "react";
import { ethers } from "ethers";
import useBettingContract from "./use-betting-contract";
import reportHash from "@/utils/report-hash";
import useGelatonetwork from "./use-gelatonetwork";
import { useAuth } from "@/contexts/auth/privy";

export default function useDraw(
  onSuccess: (isWinner: boolean) => void,
  onError: () => void
) {
  const [drawing, setDrawing] = useState(false);
  const toast = useToast();
  const BettingContract = useBettingContract();
  const { executeTransaction } = useGelatonetwork();
  const { updateQuoteTokenBalance, address } = useAuth();

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

      const method = "sponsoredDraw";
      const userRandomNumber = ethers.utils.hexlify(
        ethers.utils.randomBytes(32)
      );
      const params = [poolId, times, userRandomNumber];

      const tx = await BettingContract.populateTransaction[method](...params);

      const estimateGas = await BettingContract.estimateGas[method](...params);
      console.log("estimateGas", estimateGas);

      executeTransaction({
        calls: [tx],
        onSuccess: async (receipt: any) => {
          if (receipt?.status === 1) {
            const refundableRequests =
              await BettingContract.getRefundableRequestsPaginated(
                address,
                poolId
              );
            const refundableRequest = refundableRequests[0]?.slice(-1)[0];
            let isWinner = false;
            let count = 0;

            while (count < 10) {
              try {
                const bidResult = await BettingContract.drawRequests(
                  poolId,
                  refundableRequest
                );
                console.log("bidResult", bidResult);
                if (bidResult.status === 1) {
                  isWinner = bidResult.isWinner;
                  break;
                }
                await new Promise((resolve) => setTimeout(resolve, 2000));
                count++;
              } catch (error) {
                console.error("Error checking pool state:", error);
                break;
              }
            }

            onSuccess(isWinner);
            toast.success({
              title: isWinner ? "You are the winner" : "Draw success"
            });
            updateQuoteTokenBalance();
          } else {
            toast.fail({ title: "Bid failed" });
          }

          setDrawing(false);
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
