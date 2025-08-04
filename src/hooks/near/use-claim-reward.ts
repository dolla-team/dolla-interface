import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { transactions } from "near-api-js";
import { useNearWallet } from "@/contexts/wallet/near";
import nearChainConfig from "@/config/near";

export default function useClaimFunds({
  onClaimSuccess
}: {
  onClaimSuccess?: () => void;
}) {
  const [claiming, setClaiming] = useState(false);
  const toast = useToast();
  const { accountId, wallet } = useNearWallet();
  const onClaim = async (orderId: number) => {
    if (!accountId) {
      toast.fail({ title: "Please connect your wallet" });
      return;
    }

    if (!wallet) {
      toast.fail({ title: "Wallet not available" });
      return;
    }

    let toastId = toast.loading({ title: "Claiming..." });
    try {
      setClaiming(true);

      const actions = [
        transactions.functionCall(
          "claim_prize",
          {
            game_id: orderId
          },
          200000000000000n, // 200 TGAS
          1n // 1 yoctoNEAR
        )
      ];

      const result = await wallet.signAndSendTransactions({
        transactions: [
          {
            receiverId: nearChainConfig.contractAddress,
            actions
          }
        ]
      });

      toast.dismiss(toastId);
      toast.success({ title: "Claim successfully" });
      onClaimSuccess?.();
    } catch (error: any) {
      console.error("Create error:", error);
      toast.dismiss(toastId);
      toast.fail({ title: "Claim failed", text: error?.message });
      throw error;
    } finally {
      setClaiming(false);
    }
  };

  return {
    claiming,
    onClaim
  };
}
