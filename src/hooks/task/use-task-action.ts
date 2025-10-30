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
import useBindSocial from "./use-bind-social";
import { TELEGRAM_BOT, TELEGRAM_BOT_ID, TWITTER_CLIENT_ID } from "@/config";
import { useAuth } from "@/contexts/auth";

export default function useTaskAction(task: any, onSuccess?: () => void) {
  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const [completed, setCompleted] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const { userInfo } = useAuth();

  const { fetchTasks } = useTaskCurrent();
  const navigate = useNavigate();
  const { onCopy } = useCopy();
  const taskStore = useTaskStore();
  const toast = useToast();
  const { handleBind } = useBindSocial();

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
    if (task.category === 0 && task.title === "Follow Twitter") {
      const path = userInfo?.twitter_user_id
        ? `https://x.com/intent/follow?screen_name=Dollamarket`
        : `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${TWITTER_CLIENT_ID}&redirect_uri=${window.location.href}&scope=tweet.read%20users.read%20follows.read%20like.read&state=state&code_challenge=challenge&code_challenge_method=plain`;
      window.open(path, "_blank");
      if (!!userInfo?.twitter_user_id) await completeTask(task.id);
      return;
    }
    if (task.category === 0 && task.title === "Join Telegram") {
      if (!userInfo?.telegram_user_id) {
        if (window.Telegram) {
          window.Telegram.Login.auth(
            { bot_id: TELEGRAM_BOT_ID, request_access: true },
            (data: any) => {
              if (data) {
                handleBind("telegram", { ...data, id: data.id.toString() });
                console.log("telegram data", data);
              }
            }
          );
        }
      } else {
        window.open(`https://t.me/${TELEGRAM_BOT}`, "_blank");
        await completeTask(task.id);
      }
      return;
    }
    if (task.category === 0 && task.title === "Subscribe to TG Channel") {
      window.open(`https://t.me/+rlArBTaYhw8zNDM1`, "_blank");
      await completeTask(task.id);
      return;
    }
    if (
      task.category === 0 &&
      ["Like a Tweet", "Like & RT a Tweet"].includes(task.title)
    ) {
      const path = `https://x.com/Dollamarket`;
      window.open(path, "_blank");
      await completeTask(task.id);
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
