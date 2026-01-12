import { useEffect, useRef, useState, useCallback } from "react";
import axiosInstance from "@/libs/axios";

interface UsePoolBidsParams {
  chain: string;
  pool_id: number;
}

interface PoolBid {
  [key: string]: any;
}

const LIMIT = 10;

export default function usePoolBids(params: UsePoolBidsParams) {
  const { chain, pool_id } = params;
  const [page, setPage] = useState(1);
  const [bids, setBids] = useState<PoolBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate offset from page
  const offset = (page - 1) * LIMIT;

  const fetchPoolBids = useCallback(
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
          limit: LIMIT.toString(),
          offset: offset.toString(),
          pool_id: pool_id.toString()
        });

        const res = await axiosInstance.get(
          `/api/v1/pool/bids?${queryParams.toString()}`
        );

        const bidsList = res.data?.list || res.data?.list || [];
        const hasNextPage = res.data?.has_next_page || false;

        setBids(bidsList);
        setHasMore(hasNextPage);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch pool bids:", error);
        setLoading(false);
      } finally {
        // Set timer for next refresh (30 seconds)
        // timerRef.current = setTimeout(() => {
        //   fetchPoolBids(true);
        // }, 30000);
      }
    },
    [chain, pool_id, page]
  );

  // Reset page when pool_id changes
  useEffect(() => {
    setPage(1);
  }, [pool_id]);

  useEffect(() => {
    // Initial fetch
    if (pool_id) {
      fetchPoolBids();
    }

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [pool_id, page, fetchPoolBids]);

  // Reset to first page
  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  // Go to specific page
  const goToPage = useCallback(
    (targetPage: number) => {
      if (targetPage >= 1 && !loading) {
        setPage(targetPage);
      }
    },
    [loading]
  );

  return {
    bids,
    loading,
    hasMore,
    page,
    offset,
    setPage,
    resetPage,
    goToPage,
    refetch: () => fetchPoolBids()
  };
}
