import { useEffect, useRef, useState, useCallback } from "react";
import axiosInstance from "@/libs/axios";

interface UseTopBiddersParams {
  chain: string;
  limit: number;
  offset: number;
  pool_id: number;
}

export default function useTopBidders(params: UseTopBiddersParams) {
  const { chain, limit, offset, pool_id } = params;
  const [topBidders, setTopBidders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTopBidders = useCallback(
    async (withoutLoading = false) => {
      if (!pool_id) return;
      try {
        // Clear existing timer
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        if (!withoutLoading) {
          setLoading(true);
        }

        const queryParams = new URLSearchParams({
          chain,
          limit: limit.toString(),
          offset: offset.toString(),
          pool_id: pool_id.toString()
        });

        const res = await axiosInstance.get(
          `/api/v1/pool/top/bidders?${queryParams.toString()}`
        );

        const _list = res.data?.list.map((item: any, index: number) => {
          return {
            rank: index + 1,
            name: item.user_info.name,
            amount: item.purchase_usd,
            avatar: item.user_info.icon,
            address: item.user_info.user
          };
        });

        setTopBidders(_list || []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch top bidders:", error);
        setLoading(false);
      } finally {
        // Set timer for next refresh (30 seconds)
        // timerRef.current = setTimeout(() => {
        //   fetchTopBidders(true);
        // }, 30000);
      }
    },
    [chain, limit, offset, pool_id]
  );

  useEffect(() => {
    // Initial fetch
    if (pool_id) {
      fetchTopBidders();
    }

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [pool_id]);

  return {
    topBidders,
    loading,
    refetch: () => fetchTopBidders()
  };
}
