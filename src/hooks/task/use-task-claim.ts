import { useState, useCallback } from "react";
import axiosInstance from "@/libs/axios";
import useToast from "@/hooks/use-toast";

export default function useTaskClaim(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  // Fetch task list from API
  const claimTask = useCallback(async (id: string) => {
    let toastId = toast.loading({ title: "Claiming..." });
    try {
      setLoading(true);
      await axiosInstance.post("/api/v1/task_claim", {
        task_id: id
      });
      toast.dismiss(toastId);
      toast.success({ title: "Claim successfully" });
      onSuccess?.();
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      toast.dismiss(toastId);
      toast.fail({ title: "Claim failed" });
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    claimTask
  };
}
