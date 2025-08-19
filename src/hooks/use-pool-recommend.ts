import { useState, useEffect } from "react";
import axiosInstance from "@/libs/axios";
import { useAuth } from "@/contexts/auth";

export default function usePoolRecommend(
  tokenStatus: number,
  autoQuery = true
) {
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();
  const [data, setData] = useState<any>({});

  const getPoolRecommend = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/v1/pool/recommend?token_status=${tokenStatus}&chain=Berachain`
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
    if (userInfo?.user && autoQuery) {
      getPoolRecommend();
    }
  }, [userInfo, autoQuery]);

  return {
    data,
    loading,
    getPoolRecommend
  };
}
