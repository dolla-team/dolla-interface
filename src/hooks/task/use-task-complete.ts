import { useState, useCallback } from "react";
import axiosInstance from "@/libs/axios";

export default function useTaskComplete(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  // Fetch task list from API
  const completeTask = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await axiosInstance.post("/api/v1/task_complete", {
        task_id: id
      });
      onSuccess?.();
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    completeTask
  };
}
