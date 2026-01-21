import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "@/libs/axios";
import useToast from "@/hooks/use-toast";

/**
 * Hook to check if there is a reward for a given code
 * Automatically checks reward if xCode parameter exists in URL
 * @returns Function to check reward by code and hasReward status
 */
export default function useCheckXkol() {
  const hasCheckedRef = useRef(false);
  const toast = useToast();
  const [reward, setReward] = useState(0);
  const [redeeming, setRedeeming] = useState(false);

  const xCode = new URLSearchParams(window.location.search).get("xCode");

  /**
   * Check if there is a reward for the given code
   * @param code - The voucher code to check
   * @returns Promise that resolves to true if reward exists, false otherwise
   */
  const checkReward = useCallback(async (code: string) => {
    if (!code) {
      return;
    }

    try {
      const response = await axiosInstance.get(
        "/api/v1/code/invite/gift/info",
        {
          params: {
            code
          }
        }
      );

      // Check if the request was successful and has reward data
      if (response.data?.code === 0) {
        setReward(
          response?.data?.data?.is_used ? 0 : response.data.data?.amount ?? 0
        );
      }
    } catch (error) {
      console.error("Check reward error:", error);
      setReward(0);
    }
  }, []);

  const redeemReward = useCallback(async () => {
    let toastId = toast.loading({ title: "Redeeming reward..." });
    try {
      setRedeeming(true);
      const response = await axiosInstance.post("/api/v1/gift/voucher/redeem", {
        code: xCode
      });
      if (response.data.code !== 0) {
        toast.fail({ title: "Redeeming reward failed" });
        return;
      }
      setReward(0);
      toast.success({ title: "Redeeming reward successfully" });
    } catch (error) {
      console.error("Redeeming reward error:", error);
      toast.dismiss(toastId);
      toast.fail({ title: "Redeeming reward failed" });
    } finally {
      setRedeeming(false);
    }
  }, [xCode]);

  // Automatically check reward if xCode exists in URL
  useEffect(() => {
    if (xCode && !hasCheckedRef.current) {
      hasCheckedRef.current = true;
      checkReward(xCode);
    }
  }, [xCode]);

  return {
    reward,
    redeemReward,
    redeeming
  };
}
