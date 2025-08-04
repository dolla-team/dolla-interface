import { useState } from "react";
import useToast from "@/hooks/use-toast";

export default function useClaimFunds({
  onClaimSuccess
}: {
  onClaimSuccess?: () => void;
}) {
  const [claiming, setClaiming] = useState(false);
  const toast = useToast();
  const onClaim = async (orderId: number) => {
    let toastId = toast.loading({ title: "Claiming..." });
    try {
      setClaiming(true);

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
