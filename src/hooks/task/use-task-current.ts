import { useCallback } from "react";
import axiosInstance from "@/libs/axios";
import useTaskStore, { initProgressTasks } from "@/stores/use-task";

export default function useTaskCurrent() {
  const taskStore = useTaskStore();

  // Fetch task list from API
  const fetchTasks = useCallback(async () => {
    try {
      if (!taskStore.initialized) taskStore.set({ loading: true });

      const response = await axiosInstance.get("/api/v1/task_current");
      const listResponse = await axiosInstance.get("/api/v1/task_list");

      // Handle different response structures
      const data = response.data.data || {};

      let _progressTasks = JSON.parse(JSON.stringify(initProgressTasks));
      [...(data.fixed_tasks || []), ...(data.ongoing_tasks || [])].forEach(
        (item: any) => {
          if (!item.is_claimed) _progressTasks[item.category].list.push(item);
        }
      );

      const tasks = [
        ...(data.fixed_tasks || []),
        ...(data.ongoing_tasks || [])
      ].filter((item: any) => !item.is_claimed);

      taskStore.set({
        tasks: tasks,
        progressTasks: Object.values(_progressTasks),
        completedTasks: listResponse.data.data?.completed_tasks || [],
        loading: false,
        initialized: true
      });
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      taskStore.set({
        tasks: [],
        progressTasks: Object.values(initProgressTasks),
        completedTasks: [],
        loading: false
      });
    }
  }, []);

  return {
    fetchTasks
  };
}
