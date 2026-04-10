import axiosInstance from "@/libs/axios";
import { useState, useCallback } from "react";
import { useAuth } from '@/contexts/wallet'
import useToast from "../use-toast";

const MAPS = {
  twitter: {
    label: "Twitter",
    path: "/api/v1/bind/twitter"
  },
  telegram: {
    label: "Telegram",
    path: `/api/v1/bind/telegram`
  }
};

type AuthType = "telegram" | "twitter";

export default function useAuthBind() {
  const [loading, setLoading] = useState(false);
  const { onQueryUserInfo } = useAuth();
  const toast = useToast();

  const handleBind = useCallback(
    async (type: AuthType, data?: any) => {
      if (loading) return;

      setLoading(true);
      const config = MAPS[type];
      const toastId = toast.loading({ title: "Binding..." });
      try {
        let params = {};
        if (type === "twitter") {
          params = {
            code: data,
            redirect_url: window.location.origin + window.location.pathname
          };
        }
        if (type === "telegram") {
          params = {
            ...data
          };
        }

        const result = await axiosInstance.post(config.path, params);
        if (result.data.code !== 0) throw new Error(result.data.msg);
        toast.dismiss(toastId);
        toast.success({ title: "Bind successfully" });
        setLoading(false);
        onQueryUserInfo();
      } catch (err) {
        toast.dismiss(toastId);
        toast.fail({ title: "Bind failed" });
        setLoading(false);
      }
    },
    [loading]
  );

  return { loading, handleBind };
}
