import { useState, useEffect } from "react";
import axiosInstance from "@/libs/axios";
import { useAuth } from "@/contexts/auth";
import { BASE_TOKEN } from "@/config/btc";

export default function usePoolRecommend(
  tokenStatus: number,
  autoQuery = true
) {
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();
  const [data, setData] = useState<any>({});

  const getPoolRecommend = async (volume?: number) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/v1/pool/recommend?token_status=${tokenStatus}&chain=solana&token=${
          BASE_TOKEN.address
        }${volume ? `&volume=${volume}` : ""}`
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
