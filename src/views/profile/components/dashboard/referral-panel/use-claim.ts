import { useState, useCallback, useEffect } from "react";
import axiosInstance from "@/libs/axios";
import useToast from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import Big from "big.js";

// Response interface for claimable rewards query
interface ClaimableRewardResponse {
  code?: number;
  data?: {
    claimable?: number;
    [key: string]: any;
  };
  message?: string;
}

// Response interface for claim reward
interface ClaimRewardResponse {
  code?: number;
  data?: any;
  message?: string;
}

export default function useClaim(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimableAmount, setClaimableAmount] = useState<any>({});
  const toast = useToast();
  const { userInfo } = useAuth();

  // Query claimable rewards from API
  const fetchClaimableRewards = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<ClaimableRewardResponse>(
        "/api/v1/reward/claimable"
      );

      // Handle response data
      const claimable = response.data?.data?.rewards_by_token ?? [];

      let totalUsd = Big(0);
      let totalClaimable = Big(0);
      claimable.forEach((item: any) => {
        totalUsd = totalUsd.add(Big(item.total_amount_usd));
        totalClaimable = totalClaimable.add(Big(item.claimable_amount_usd));
        if (item.token_type === "USDT") {
          item.claimable_amount_usd = item.claimable_amount;
          item.total_amount_usd = item.total_amount;
        }
      });

      setClaimableAmount({
        totalUsd: totalUsd.toString(),
        totalClaimable: totalClaimable.toString(),
        tokens: claimable,
        user_type: response.data?.data?.user_type
      });
    } catch (err: any) {
      console.error("Failed to fetch claimable rewards:", err);
      setClaimableAmount({});
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Claim rewards from API
  const claimRewards = useCallback(async () => {
    let toastId = toast.loading({ title: "Claiming..." });
    try {
      setClaiming(true);
      const response = await axiosInstance.post<ClaimRewardResponse>(
        "/api/v1/reward/claim"
      );

      // Check if claim was successful
      if (response.data?.code === 0 || response.status === 200) {
        toast.dismiss(toastId);
        toast.success({ title: "Claim successfully" });
        onSuccess?.();
        // Refresh claimable amount after successful claim
        fetchClaimableRewards();
      } else {
        throw new Error(response.data?.message || "Claim failed");
      }
    } catch (err: any) {
      console.error("Failed to claim rewards:", err);
      toast.dismiss(toastId);
      toast.fail({
        title: err?.response?.data?.message || "Claim failed"
      });
      throw err;
    } finally {
      setClaiming(false);
    }
  }, [toast, onSuccess]);

  useEffect(() => {
    if (userInfo?.user) {
      fetchClaimableRewards();
    }
  }, [userInfo?.user]);

  return {
    loading,
    claiming,
    claimableAmount,
    fetchClaimableRewards,
    claimRewards
  };
}
