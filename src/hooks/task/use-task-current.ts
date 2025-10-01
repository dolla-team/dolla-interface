import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/libs/axios";
import { useAuth } from "@/contexts/auth";

export default function useTaskCurrent() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();

  // Fetch task list from API
  const fetchTasks = useCallback(async () => {
    try {
      if (tasks.length === 0) setLoading(true);

      const response = await axiosInstance.get("/api/v1/task_current");

      // Handle different response structures
      const data = response.data.data || {};

      setTasks(
        [...(data.fixed_tasks || []), ...(data.ongoing_tasks || [])].filter(
          (item: any) => !item.is_claimed
        )
      );
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);

      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (userInfo?.user) {
      fetchTasks();
    }
  }, [userInfo?.user]);

  return {
    tasks,
    loading,
    fetchTasks
  };
}
