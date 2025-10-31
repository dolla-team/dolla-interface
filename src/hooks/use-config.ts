import axiosInstance from "@/libs/axios";
import { useConfigStore } from "@/stores/use-config";
import { useEffect } from "react";

export default function useConfig() {
  const configStore = useConfigStore();

  const getConfig = async () => {
    axiosInstance.get("/api/v1/config").then((res) => {
      const config = res.data.data;
      const prizeAmount = config.ticket_prize?.reduce(
        (acc: number, curr: any) => {
          return acc + curr.volume * curr.winner_count;
        },
        0
      );
      configStore.set({ config: { ...config, prizeAmount } });
    });
  };

  useEffect(() => {
    if (configStore.config) return;
    getConfig();
  }, []);

  return {
    getConfig
  };
}
