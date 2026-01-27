import { useMemo, useState } from "react";
import dollaService from "@/service/kol-anysis";
import { useAnalysisDataStore } from "@/stores/use-analysis-data";

export default function useAnalysis() {
  const [xProfileUrl, setXProfileUrl] = useState("");
  const { set } = useAnalysisDataStore();

  const isValid = useMemo(() => {
    if (xProfileUrl === "") {
      return true;
    }
    if (xProfileUrl.includes(" ")) {
      return false;
    }
    if (xProfileUrl.includes("https://")) {
      const twitterPattern = /^https:\/\/(twitter\.com|x\.com)\/[^\s]+$/;
      return twitterPattern.test(xProfileUrl);
    }
    const twitterHandlePattern = /^[a-zA-Z_][a-zA-Z0-9_]{0,14}$/;
    return twitterHandlePattern.test(xProfileUrl);
  }, [xProfileUrl]);

  const handle = useMemo(() => {
    return xProfileUrl?.split("/").pop();
  }, [xProfileUrl]);

  const onAnalyze = async () => {
    set({ status: "loading" });
    const startTime = Date.now();
    try {
      const response = await dollaService.memeFate(handle ?? '')
      const rewardResponse = await dollaService.checkReward(handle ?? '')

      set({ reward: rewardResponse?.data?.data?.amount })

      const elapsedTime = Date.now() - startTime
      const remainingTime = Math.max(0, 5000 - elapsedTime)

      await new Promise(resolve => setTimeout(resolve, remainingTime))

      set({
        result: response.data?.data || {},
        reward: rewardResponse?.data?.data?.amount,
        status: 'result',
        handle: handle ?? '',
        xCode: response?.data?.data?.inviteCode ?? '',
      })
    } catch (error) {
      console.error(error);
      set({ status: "input", amount: 0, result: null });
    }
  };

  return {
    handle,
    isValid,
    xProfileUrl,
    setXProfileUrl,
    onAnalyze
  };
}
