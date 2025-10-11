import axiosInstance from "@/libs/axios";
import { useGlobalStore } from "@/stores/use-global";

export default function useCode() {
  const globalStore = useGlobalStore();

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
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) return;
    await axiosInstance.post("/api/v1/airdrop/binding/code", {
      code
    });
  };

  return {
    getCode,
    bindingCode
  };
}
