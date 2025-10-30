import { useCallback } from "react";
import { useRequest } from "ahooks";
import axiosInstance from "@/libs/axios";

export default function useCreateWhitelist(email?: string) {
  const service = useCallback(async () => {
    try {
      if (!email) return false;
      const res = await axiosInstance.get("/api/v1/user/create/whitelist", {
        params: { email }
      });

      return res?.data?.data?.is_whitelist;
    } catch (err) {
      return false;
    }
  }, [email]);

  const { data } = useRequest(service, {
    refreshDeps: [email]
  });

  return {
    isCreatedWhitelist: data
  };
}
