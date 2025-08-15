import { useState } from "react";
import Big from "big.js";
import config from "@/config/bera";
import useToast from "@/hooks/use-toast";
import useBettingContract from "./use-betting-contract";
import reportHash from "@/utils/report-hash";
import useGelatonetwork from "./use-gelatonetwork";

export default function useCreate({
  token,
  amount,
  anchorPrice,
  onCreateSuccess
}: {
  token: any;
  amount: number;
  anchorPrice: number;
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

      // check token is whitelisted
      const [purchaseTokens, erc20RewardTokens, erc721RewardTokens] =
        await BettingContract.getAllWhitelistedTokens();
      const isPurchaseTokenWhitelisted = purchaseTokens.filter(
        (item: any) =>
          item.toLowerCase() === config.purchaseToken.address.toLowerCase()
      );

      const isRewardTokenWhitelisted = (
        token.type === "nft" ? erc721RewardTokens : erc20RewardTokens
      ).filter(
        (item: any) => item.toLowerCase() === token.address.toLowerCase()
      );

      if (
        !isPurchaseTokenWhitelisted.length ||
        !isRewardTokenWhitelisted.length
      ) {
        throw new Error("Token not whitelisted");
      }

      const rewardAmount =
        token.type === "nft"
          ? 0
          : Big(amount * 10 ** token.decimals).toFixed(0);

      const drawFee = Big(1 * 10 ** config.purchaseToken.decimals).toFixed(0);

      const tx = await BettingContract.populateTransaction.createPool(
        config.purchaseToken.address,
        token.address,
        rewardAmount,
        token.id || token.id === 0 ? [token.id] : [], // nftIds
        drawFee,
        Big(anchorPrice * 10 ** config.purchaseToken.decimals).toFixed(0)
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
