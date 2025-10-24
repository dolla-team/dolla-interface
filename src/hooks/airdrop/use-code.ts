import axiosInstance from "@/libs/axios";
import { useGlobalStore } from "@/stores/use-global";
import { useEffect } from "react";

export default function useCode(userInfo?: any) {
  const globalStore = useGlobalStore();
  const code = new URLSearchParams(window.location.search).get("code");

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
    if (userInfo?.user && code) {
      bindingCode();
    }
  }, [userInfo?.user, code]);

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
