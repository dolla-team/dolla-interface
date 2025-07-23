import axiosInstance from "@/libs/axios";
import { useState } from "react";

export default function usePoolInfo(chain: string) {
  const [loading, setLoading] = useState(false);
  const [poolInfo, setPoolInfo] = useState<any>(null);

  const onQueryPoolInfo = async (poolId?: number) => {
    try {
      if (!poolId) return;
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/v1/pool?pool_id=${poolId}&chain=${chain}`
      );
      setPoolInfo(res.data.data);
      return res.data.data;
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return { loading, poolInfo, onQueryPoolInfo };
}
