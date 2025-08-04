import useToast from "@/hooks/use-toast";
import { useState, useEffect, useRef } from "react";
import { useNearWallet } from "@/contexts/wallet/near";
import axiosInstance from "@/libs/axios";
import { transactions } from "near-api-js";
import reportHash from "@/utils/report-hash";
import nearChainConfig from "@/config/near";

export default function useBid(
  poolId: number,
  onSuccess: (result: any) => void,
  onTxSuccess: () => void,
  onTxFail: () => void
) {
  const [bidding, setBidding] = useState(false);
  const toast = useToast();
  const { accountId, selector } = useNearWallet();
  const walletRef = useRef<any>(null);

  useEffect(() => {
    const initWallet = async () => {
      if (selector) {
        const wallet = await selector.wallet();
        walletRef.current = wallet;
      }
    };

    initWallet();
  }, [selector]);

  const onBid = async (times: number) => {
    if (!accountId) {
      toast.fail({ title: "Please connect your wallet" });
      return;
    }

    if (!walletRef.current) {
      toast.fail({ title: "Wallet not available" });
      return;
    }

    let toastId = toast.loading({ title: "Submit Transaction..." });
    setBidding(true);

    try {
      // Get the contract address from environment variables
      const contractAddress = nearChainConfig.contractAddress;

      // Construct the transaction
      const actions = [
        transactions.functionCall(
          "bid", // method name
          {
            pool_id: poolId,
            bid_count: times
          }, // args
          300000000000000n, // gas (as bigint)
          100000000000000000000000n // deposit (0.1 NEAR as yoctoNEAR)
        )
      ];

      // Sign and send the transaction
      const result = await walletRef.current.signAndSendTransactions({
        transactions: [
          {
            receiverId: contractAddress,
            actions
          }
        ]
      });

      toast.dismiss(toastId);
      toastId = toast.success({ title: "Bid placed successfully!" });
      onTxSuccess();
      setBidding(false);

      // Poll for result
      let bidResponse = null;
      let timer: any = null;
      console.time("bid loop");

      const loop = async () => {
        try {
          // Assuming you have an API endpoint to check bid status
          // Fallback to empty string if result.transaction.hash is null
          const hash = result?.transaction?.hash || "";
          if (!hash) {
            console.warn("Transaction hash is missing");
            return;
          }

          bidResponse = await axiosInstance.get(
            `/api/v1/user/prize/bid?hash=${hash}`
          );

          if (
            bidResponse.data.data.bid !== null &&
            bidResponse.data.data.bid.status !== 0
          ) {
            console.timeEnd("bid loop");
            console.log("bidResponse", bidResponse.data.data);
            onSuccess(bidResponse.data.data);
            return;
          }

          if (timer) {
            clearTimeout(timer);
          }

          timer = setTimeout(loop, 1000);
        } catch (error) {
          console.error("Error polling for bid result:", error);
          if (timer) {
            clearTimeout(timer);
          }
        }
      };

      loop();

      // Report hash for tracking
      // Fallback values for hash and block_number if they're missing
      const hash = result?.transaction?.hash || "";
      const blockNumber = result?.transaction_outcome?.block_hash || "";

      if (hash && blockNumber) {
        reportHash({
          chain: "near",
          user: accountId,
          hash: hash,
          block_number: blockNumber
        });
      }
    } catch (error) {
      console.error("Bid error:", error);
      setBidding(false);
      toast.dismiss(toastId);
      toast.fail({
        title: "Bid failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred"
      });
      onTxFail();
    }
  };

  return {
    bidding,
    onBid
  };
}
