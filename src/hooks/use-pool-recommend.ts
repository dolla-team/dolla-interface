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

      let data = null;

      if (volume) {
        const response = await axiosInstance.get(
          `/api/v1/pool/list?limit=1&offset=0&sort_field=accumulative_bids&sort_order=asc&status=1&chain=near&token_status=${tokenStatus}${
            volume ? "&volume=" + volume : ""
          }`
        );
        data = response.data.data?.list?.[0];
      } else {
        const response = await axiosInstance.get(
          `/api/v1/pool/recommend?token_status=${tokenStatus}&chain=${"near"}${
            volume ? `&volume=${volume}` : ""
          }`
        );
        data = response.data.data?.[0];
      }

      setData(data);
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
