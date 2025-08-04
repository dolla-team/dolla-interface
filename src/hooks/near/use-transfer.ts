import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";

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

  const onTransfer = async (amount: number, to?: string) => {
    let toastId = toast.loading({ title: "Transferring..." });
    try {
      setTransferring(true);

      onTransferSuccess?.(amount);
    } catch (error) {
      console.error("Create error:", error);
      toast.dismiss(toastId);
      toast.fail({
        title: "Transfer failed"
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
