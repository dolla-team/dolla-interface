import axiosInstance from "@/libs/axios";
import { useState, useEffect } from "react";
import { useAuth } from '@/contexts/wallet'
import Big from "big.js";

const PAGE_SIZE = 20;

export default function useUserWon() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const { userInfo } = useAuth();

  const fetchUserWonData = async (pageNum: number, isRefresh = false) => {
    if (!userInfo?.user) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(`/api/v1/user/player/history`, {
        params: {
          limit: PAGE_SIZE,
          winner: "1",
          offset: (pageNum - 1) * PAGE_SIZE
        }
      });

      const list = response.data.data?.list || [];

      if (isRefresh || pageNum === 1) {
        setData(list);
      } else {
        setData((prev) => [...prev, ...list]);
      }

      setHasMore(response.data.data.has_next_page);
      setTotal(response.data.data.total);
    } catch (err: any) {
      console.error("Failed to fetch user won data:", err);
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts or user changes
  useEffect(() => {
    if (userInfo?.user) {
      setPage(1);
      fetchUserWonData(1, true);
    }
  }, [userInfo?.user]);

  // Load more data when page changes
  useEffect(() => {
    if (page > 1 && userInfo?.user) {
      fetchUserWonData(page, false);
    }
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setError(null);
    fetchUserWonData(1, true);
  };

  const reset = () => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setTotal(0);
  };

  return {
    // Data
    data,
    loading,
    error,
    hasMore,
    total,
    page,

    // Actions
    loadMore,
    refresh,
    reset,

    // Computed values
    isEmpty: !loading && data.length === 0,
    isError: !!error
  };
}
