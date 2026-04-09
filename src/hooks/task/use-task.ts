import { useState, useEffect } from "react";
import axiosInstance from "@/libs/axios";
import { useAuth } from '@/contexts/wallet'

const initProgressTasks: any = {
  "0": {
    title: "Social Tasks",
    list: []
  },
  "1": {
    title: "Referral Objectives",
    list: []
  },
  "2": {
    title: "Deposit Objectives",
    list: []
  },
  "3": {
    title: "Bid Objectives",
    list: []
  },
  "4": {
    title: "Swap Objectives",
    list: []
  }
};

export default function useTaskList() {
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [progressTasks, setProgressTasks] = useState<any>(
    Object.values(initProgressTasks)
  );
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();
  const [initialized, setInitialized] = useState(true);

  // Fetch task list from API
  const fetchTasks = async () => {
    try {
      if (initialized) setLoading(true);

      setInitialized(false);

      const response = await axiosInstance.get("/api/v1/task_list");
      // Handle different response structures
      const data = response.data.data || {};

      setCompletedTasks(data.completed_tasks || []);

      let _progressTasks = JSON.parse(JSON.stringify(initProgressTasks));
      [...data.fixed_tasks, ...data.ongoing_tasks].forEach((item: any) => {
        if (!item.is_claimed) _progressTasks[item.category].list.push(item);
      });

      setProgressTasks(Object.values(_progressTasks));
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);

      setCompletedTasks([]);
      setProgressTasks(Object.values(initProgressTasks));
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    if (userInfo?.user) {
      fetchTasks();
    }
  }, [userInfo?.user]);

  return {
    completedTasks,
    progressTasks,
    loading,
    fetchTasks
  };
}
