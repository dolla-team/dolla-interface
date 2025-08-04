import { useState } from "react";
import useToast from "@/hooks/use-toast";

export default function useMarkCancel({
  onCancelSuccess
}: {
  onCancelSuccess?: () => void;
}) {
  const [canceling, setCanceling] = useState(false);
  const toast = useToast();
  const onCancel = async (orderId: number) => {
    let toastId = toast.loading({ title: "Mark cancel..." });
    try {
      setCanceling(true);

      toast.dismiss(toastId);
      toast.success({ title: "Mark cancel successfully" });
      onCancelSuccess?.();
    } catch (error: any) {
      console.error("Create error:", error);
      toast.dismiss(toastId);
      toast.fail({ title: "Mark cancel failed", text: error?.message });
      throw error;
    } finally {
      setCanceling(false);
    }
  };

  return {
    canceling,
    onCancel
  };
}
