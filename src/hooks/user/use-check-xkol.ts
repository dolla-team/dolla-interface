import { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance from "@/libs/axios";
import useToast from "@/hooks/use-toast";
import useGenerateKey from "@/hooks/near/use-generate-key";
import { useAuth } from '@/contexts/wallet'
import { useSignMessage } from "@privy-io/react-auth";
import { getUserId } from "../near/util";
import { useAnalysisDataStore } from "@/stores/use-analysis-data";

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
  const { signMessage } = useSignMessage();
  const { generateKeyPair } = useGenerateKey();
  const { address, chainType } = useAuth();
  const analysisData = useAnalysisDataStore();

  const xCode = analysisData?.xCode;

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
        if (response?.data?.data?.is_used) {
          analysisData.set({ xCode: '' })
        }
      }
    } catch (error) {
      console.error("Check reward error:", error);
      setReward(0);
    }
  }, []);

  const redeemReward = useCallback(async () => {
    let toastId = toast.loading({ title: "Redeeming reward..." });
    try {
      const { publicKey, isRegistered } = await generateKeyPair(true);
       if (!publicKey && !isRegistered) {
        toast.info({
          title: "Please login to bind gift code"
        });
        return;
      }
      setRedeeming(true);
       let bindingRes: any = null;
      if (!isRegistered) {
        // new account
        const time = Date.now();
        const message = {
          user_id: getUserId(address, chainType),
          invite_code: xCode,
          operation_key: publicKey
        };
        console.log("message", message);
        const { signature: privySignature } = await signMessage({
          message: JSON.stringify(message)
        });

        bindingRes = await axiosInstance.post("/api/v1/code/invite/gift/redeem", {
          code: xCode,
          signature: privySignature.replace(/^0x/, ""),
          public_key: publicKey,
          time: time
        });
      } else {
        // old account
        bindingRes = await axiosInstance.post("/api/v1/gift/voucher/redeem", {
          code: xCode
        });
      }
      if (bindingRes.data.code !== 0) {
        toast.fail({ title: "Redeeming reward failed" });
        return;
      }
      setReward(0);
      toast.success({ title: "Redeeming reward successfully" });
      analysisData.set({ xCode: '' })
    } catch (error) {
      console.error("Redeeming reward error:", error);
      toast.dismiss(toastId);
      toast.fail({ title: "Redeeming reward failed" });
    } finally {
      setRedeeming(false);
    }
  }, [xCode, address, chainType]);

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
