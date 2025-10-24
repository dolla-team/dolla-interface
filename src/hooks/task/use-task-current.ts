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
      let _tasks: any = [];
      let _tasksMap: any = {};
      [...(data.fixed_tasks || []), ...(data.ongoing_tasks || [])].forEach(
        (item: any) => {
          if (!item.is_claimed) {
            _tasksMap[item.id] = item;
            _tasks.push(item.id);

            _progressTasks[
              item.category === 6 || item.category === 7 ? 1 : item.category
            ].list.push(item.id);
          }
        }
      );

      taskStore.set({
        tasks: _tasks,
        progressTasks: Object.values(_progressTasks),
        completedTasks: listResponse.data.data?.completed_tasks || [],
        loading: false,
        initialized: true,
        tasksMap: _tasksMap
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
