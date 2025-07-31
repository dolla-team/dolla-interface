import axiosInstance from "@/libs/axios";
import { useConfigStore } from "@/stores/use-config";
import { useEffect } from "react";

export default function useConfig() {
  const configStore = useConfigStore();

  const getConfig = async () => {
    axiosInstance.get("/api/v1/config").then((res) => {
      configStore.set({ config: res.data.data });
    });
  };

  useEffect(() => {
    if (configStore.config) return;
    getConfig();
  }, []);

  return {
    getConfig,
  };
}
