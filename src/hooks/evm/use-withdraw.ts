import { ethers } from "ethers";
import { useState } from "react";
import nftAbi from "@/config/abis/evm-nft";
import tokenAbi from "@/config/abis/evm-token";
import reportHash from "@/utils/report-hash";
import useToast from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import useGelatonetwork from "./use-gelatonetwork";

export default function useWithdraw(onSuccess: () => void) {
  const [withdrawing, setWithdrawing] = useState(false);
  const { wallet, updateQuoteTokenBalance } = useAuth();
  const toast = useToast();
  const { executeTransaction } = useGelatonetwork();
  const onWithdraw = async ({
    type,
    amount,
    address,
    receiveAddress,
    tokenId
  }: any) => {
    setWithdrawing(true);
    try {
      const ethereumProvider = await wallet?.getEthereumProvider();
      if (!ethereumProvider || !wallet) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereumProvider);
      const signer = provider.getSigner();
      const TokenContract = new ethers.Contract(
        address,
        type === "coin" ? tokenAbi : nftAbi,
        signer
      );
      const method =
        type === "coin"
          ? "transfer"
          : "safeTransferFrom(address,address,uint256)";
      const params =
        type === "coin"
          ? [receiveAddress, amount]
          : [wallet.address, receiveAddress, tokenId];

      const tx = await TokenContract.populateTransaction[method](...params);
      executeTransaction({
        calls: [tx],
        onSuccess: (receipt: any) => {
          console.log("receipt", receipt);
          setWithdrawing(false);
          if (receipt?.status === 0) {
            toast.fail({ title: "Withdraw failed" });
          } else {
            onSuccess?.();
            toast.success({ title: "Withdraw success" });
            if (type === "coin") {
              updateQuoteTokenBalance();
            }
          }
          reportHash({
            hash: receipt.transactionHash,
            block_number: receipt.blockNumber,
            chain: "Berachain",
            user: receipt?.from
          });
        },
        onError: () => {
          setWithdrawing(false);
          toast.fail({ title: "Withdraw failed" });
          throw new Error("Withdraw failed");
        }
      });
    } catch (err) {
      console.error(err);
      setWithdrawing(false);
      toast.fail({ title: "Withdraw failed" });
    }
  };
  return {
    withdrawing,
    onWithdraw
  };
}
