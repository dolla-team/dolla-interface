import axiosInstance from "@/libs/axios";
import { useGlobalStore } from "@/stores/use-global";
import { useEffect } from "react";
import { useVerifyStore } from '@/stores/use-verify'
import useLoginStore from '@/stores/use-login'

export default function useCode(userInfo?: any) {
  const globalStore = useGlobalStore();
  const code = new URLSearchParams(window.location.search).get("code");
  const verifyStore = useVerifyStore()
  const loginStore = useLoginStore()

  const getCode = async () => {
    if (globalStore.code) {
      return;
    }
    try {
      const res = await axiosInstance.get("/api/v1/airdrop/code");
      globalStore.set({ code: res.data.data?.code_list?.[0].code });
      return res.data.data;
    } catch (err) {
      console.error("Failed to get code:", err);
      throw err;
    } finally {
    }
  };

  const bindingCode = async () => {
    await axiosInstance.post("/api/v1/airdrop/binding/code", {
      code
    });
  };

  useEffect(() => {
    if (userInfo?.user && code && code.length === 6) {
      bindingCode()
    }
  }, [userInfo?.user, code]);

  useEffect(() => {
    if (code && code.length === 6) {
      verifyStore.set({ hasAccount: true })
      loginStore.set({ isX: false })
    }
  }, [code])

  useEffect(() => {
    if (userInfo?.user) {
      getCode();
    }
  }, [userInfo?.user]);

  return {
    getCode,
    bindingCode
  };
}
