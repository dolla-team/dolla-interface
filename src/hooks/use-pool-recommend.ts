import { useState, useEffect } from "react";
import axiosInstance from "@/libs/axios";

export default function usePoolRecommend(
  tokenStatus: number,
  chain: string,
  autoQuery = true
) {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<any>({});

  const getPoolRecommend = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/v1/pool/recommend?token_status=${tokenStatus}&chain=${chain}`
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
    if (autoQuery) {
      getPoolRecommend();
    }
  }, [autoQuery]);

  return {
    data,
    loading,
    getPoolRecommend
  };
}
