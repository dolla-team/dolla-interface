import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/libs/axios";

interface UsePoolVolumeParams {
  chain: string;
  period: "1d" | "1w" | "1m" | "all";
  pool_id: number;
}

interface VolumeDataPoint {
  timestamp: number;
  volume: number;
  is_user: boolean;
}

export default function usePoolVolume(params: UsePoolVolumeParams) {
  const { chain, period, pool_id } = params;
  const [data, setData] = useState<VolumeDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPoolVolume = useCallback(async () => {
    if (!pool_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        chain,
        period,
        pool_id: pool_id.toString()
      });

      const res = await axiosInstance.get(
        `/api/v1/pool/volume/line?${queryParams.toString()}`
      );

      // Transform API response to chart data format
      // Assuming API returns array of { timestamp, volume } or similar structure
      const volumeData = res.data?.data || [];

      // Ensure data is in correct format
      const formattedData = volumeData.map((item: any) => ({
        timestamp: item.time,
        volume: item.accumulative_bids || 0,
        is_user: item.is_user || false
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch pool volume:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [chain, period, pool_id]);

  useEffect(() => {
    fetchPoolVolume();
  }, [fetchPoolVolume]);

  return {
    data,
    loading,
    refetch: fetchPoolVolume
  };
}
