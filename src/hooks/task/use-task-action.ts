import { useCallback, useEffect, useMemo, useState } from "react";
import { getButtonText } from "./util";
import useWalletStore from "@/stores/use-wallet";
import { useNavigate } from "react-router-dom";
import useCopy from "../use-copy";
import { useGlobalStore } from "@/stores/use-global";
import useTaskComplete from "./use-task-complete";
import useTaskClaim from "./use-task-claim";
import useTaskCurrent from "./use-task-current";
import useTaskStore from "@/stores/use-task";
import useToast from "@/hooks/use-toast";
import axiosInstance from "@/libs/axios";

export default function useTaskAction(task: any, onSuccess?: () => void) {
  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const [completed, setCompleted] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { fetchTasks } = useTaskCurrent();
  const navigate = useNavigate();
  const { onCopy } = useCopy();
  const taskStore = useTaskStore();
  const toast = useToast();

  const { completeTask, loading: completeLoading } = useTaskComplete(() => {
    setCompleted(true);
    setProgress(1);
  });
  const { claimTask, loading: claimLoading } = useTaskClaim(() => {
    setClaimed(true);
    fetchTasks();
    onSuccess?.();
  });

  const [buttonText, pastButtonText] = useMemo(() => {
    if (!task) return ["", ""];
    return getButtonText(task);
  }, [task]);

  const handleTaskAction = useCallback(async () => {
    if (!task) return;
    if ((task.is_completed && !task.is_claimed) || completed) {
      await claimTask(task.id);
      return;
    }
    if (task.category === 5) {
      navigate("/btc/create");
      return;
    }
    if (task.category === 4) {
      walletStore.set({ panelType: "swap", showWallet: true });
      return;
    }
    if (task.category === 3) {
      navigate("/");
      setTimeout(() => {
        taskStore.set({ isBid: true });
      }, 300);
      // navigate("/btc/detail");
      return;
    }
    if (task.category === 2) {
      walletStore.set({ panelType: "deposit", showWallet: true });
      return;
    }
    if (task.category === 1) {
      onCopy(`${window.location.origin}?code=${globalStore.code}`);
      return;
    }

    await completeTask(task.id);
  }, [task, completed]);

  const fetchTaskStatus = useCallback(async (): Promise<any> => {
    if (!task) return;
    try {
      setRefreshing(true);
      const response = await axiosInstance.get(`/api/v1/task/${task.id}`);
      const data = response.data.data;
      setCompleted(data.is_completed);
      setClaimed(data.is_claimed);
      setProgress(data.is_completed ? 1 : data.progress);
      taskStore.set({ tasksMap: { ...taskStore.tasksMap, [task.id]: data } });

      toast.success({ title: "Refresh successfully" });
    } catch (err: any) {
      console.error("Failed to fetch task status:", err);

      toast.fail({ title: "Refresh failed" });
      return null;
    } finally {
      setRefreshing(false);
    }
  }, [task]);

  useEffect(() => {
    setCompleted(task.is_completed);
    setClaimed(task.is_claimed);
    setProgress(task.is_completed ? 1 : task.progress);
  }, [task]);

  return {
    buttonText,
    pastButtonText,
    handleTaskAction,
    fetchTaskStatus,
    loading: completeLoading || claimLoading,
    completed,
    claimed,
    progress,
    refreshing
  };
}
