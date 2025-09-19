import { useState, useEffect } from "react";
import axiosInstance from "@/libs/axios";
import useBtcStore from "@/stores/use-btc";

export default function usePoolRecommend(
  tokenStatus: number,
  autoQuery = true
) {
  const btcStore = useBtcStore();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<any>({});

  const getPoolRecommend = async (volume?: string) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/v1/pool/recommend?token_status=${tokenStatus}&chain=${"near"}${
          volume ? `&volume=${volume}` : ""
        }`
      );

      setData(response.data.data[0]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!autoQuery) return;
    getPoolRecommend(btcStore.recommendValue);
    if (btcStore.recommendValue) {
      btcStore.set({ recommendValue: "" });
    }
  }, [autoQuery]);

  return {
    data,
    loading,
    getPoolRecommend
  };
}
