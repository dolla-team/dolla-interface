import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { useNearWallet } from "@/contexts/wallet/near";
import { transactions } from "near-api-js";
import nearChainConfig from "@/config/near";

export default function useTransfer({
  token,
  type,
  onTransferSuccess
}: {
  token: any;
  type?: string;
  onTransferSuccess?: (amount: number) => void;
}) {
  const [transferring, setTransferring] = useState(false);
  const toast = useToast();
  const { updateQuoteTokenBalance } = useAuth();
  const { accountId, wallet } = useNearWallet();

  const onTransfer = async (amount: number, to?: string) => {
    if (!accountId) {
      toast.fail({ title: "Please connect your wallet" });
      return;
    }

    if (!wallet) {
      toast.fail({ title: "Wallet not available" });
      return;
    }

    let toastId = toast.loading({ title: "Transferring..." });
    try {
      setTransferring(true);

      const tokenContract = token?.address;

      const actions = [
        transactions.functionCall(
          "ft_transfer_call",
          {
            receiver_id: to || nearChainConfig.contractAddress,
            amount: amount.toString(),
            msg: JSON.stringify({
              type: type || "transfer",
              from: accountId
            })
          },
          200000000000000n, // 200 TGAS
          1n // 1 yoctoNEAR
        )
      ];

      const result = await wallet.signAndSendTransactions({
        transactions: [
          {
            receiverId: tokenContract,
            actions
          }
        ]
      });

      toast.dismiss(toastId);
      toast.success({ title: "Transfer successful!" });

      updateQuoteTokenBalance?.();

      onTransferSuccess?.(amount);

      console.log("Transfer result:", result);
    } catch (error) {
      console.error("Transfer error:", error);
      toast.dismiss(toastId);
      toast.fail({
        title: "Transfer failed",
        description:
          error instanceof Error ? error.message : "Unknown error occurred"
      });
      throw error;
    } finally {
      setTransferring(false);
    }
  };

  return {
    transferring,
    onTransfer
  };
}
