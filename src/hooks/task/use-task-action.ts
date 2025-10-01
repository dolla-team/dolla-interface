import { useCallback, useEffect, useMemo, useState } from "react";
import { getButtonText } from "./util";
import useWalletStore from "@/stores/use-wallet";
import { useNavigate } from "react-router-dom";
import useCopy from "../use-copy";
import { useGlobalStore } from "@/stores/use-global";
import useTaskComplete from "./use-task-complete";
import useTaskClaim from "./use-task-claim";

export default function useTaskAction(task: any, onSuccess?: () => void) {
  const walletStore = useWalletStore();
  const globalStore = useGlobalStore();
  const [completed, setCompleted] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();
  const { onCopy } = useCopy();

  const { completeTask, loading: completeLoading } = useTaskComplete(() => {
    setCompleted(true);
    setProgress(1);
  });
  const { claimTask, loading: claimLoading } = useTaskClaim(() => {
    setClaimed(true);
    onSuccess?.();
  });

  const [buttonText, pastButtonText] = useMemo(() => {
    return getButtonText(task);
  }, [task]);

  const handleTaskAction = useCallback(async () => {
    if ((task.is_completed && !task.is_claimed) || completed) {
      await claimTask(task.id);
      return;
    }
    if (task.category === 4) {
      walletStore.set({ panelType: "swap", showWallet: true });
      return;
    }
    if (task.category === 3) {
      navigate("/btc/detail");
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

  useEffect(() => {
    setCompleted(task.is_completed);
    setClaimed(task.is_claimed);
    setProgress(task.is_completed ? 1 : task.progress);
  }, [task]);

  return {
    buttonText,
    pastButtonText,
    handleTaskAction,
    loading: completeLoading || claimLoading,
    completed,
    claimed,
    progress
  };
}
