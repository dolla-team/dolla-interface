import { useState } from "react";
import axiosInstance from "@/libs/axios";
import useToast from "@/hooks/use-toast";

export default function useClaimTestCoin() {
  const [claiming, setClaiming] = useState(false);
  const toast = useToast();

  const claimTestCoin = async () => {
    if (claiming) return;
    let toastId = toast.loading({ title: "Claiming..." });
    try {
      setClaiming(true);
      const res = await axiosInstance.post("/api/v1/faucet");
      toast.dismiss(toastId);
      if (res.data.code === 0) {
        toast.success({ title: "Claim successfully" });
      } else if (res.data.message) {
        toast.fail({ title: res.data.message });
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.fail({ title: "Claim failed" });
    } finally {
      setClaiming(false);
    }
  };
  console.log(14, claiming);
  return {
    claiming,
    claimTestCoin
  };
}
