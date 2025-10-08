import { useState, useCallback, useRef, useEffect } from "react";
import axiosInstance from "@/libs/axios";
import { useAuth } from "@/contexts/auth";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";

// Type definitions for the records API
export interface RecordsParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface RecordsResponse {
  success: boolean;
  data: {
    list: any[];
    total: number;
    has_next_page: boolean;
    current_page: number;
  };
  message?: string;
}

const DEFAULT_LIMIT = 20;

export default function useRecords() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const pageRef = useRef(0);
  const { userInfo, address } = useAuth();
  // Fetch records with pagination (infinite scroll style)
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get<RecordsResponse>(
        "/api/v1/chaindefuser/records",
        {
          params: {
            limit: DEFAULT_LIMIT,
            offset: (pageRef.current - 1) * DEFAULT_LIMIT,
            user_address: address
          }
        }
      );

      const { data } = response.data;

      const _list = data.list.map((item: any) => {
        const rawResponse = JSON.parse(item.raw_response);

        const assetId =
          item.type === "deposit"
            ? rawResponse.quoteResponse.quoteRequest.destinationAsset
            : rawResponse.quoteResponse.quoteRequest.originAsset;

        let tokens: any[] = [];
        if (item.type === "swap") {
          tokens =
            rawResponse.quoteResponse.quoteRequest.originAsset ===
            BASE_TOKEN.assetId
              ? [BASE_TOKEN, QUOTE_TOKEN]
              : [QUOTE_TOKEN, BASE_TOKEN];
        } else {
          const token =
            assetId === BASE_TOKEN.assetId ? BASE_TOKEN : QUOTE_TOKEN;
          tokens = [token];
        }

        const amount = rawResponse.quoteResponse.quote.amountInFormatted;

        let status = item.status;
        if (item.status === "SUCCESS") {
          status = "Success";
        } else if (item.status === "FAILED") {
          status = "Failed";
        } else if (item.status === "REFUNDED") {
          status = "Refunded";
        } else {
          status = "Processing";
        }
        return {
          type: item.type,
          business_type: item.type.charAt(0).toUpperCase() + item.type.slice(1),
          tokens,
          amount,
          id: item.id,
          updated_at: item.updated_at,
          status
        };
      });

      // Update records based on whether it's a new fetch or load more
      setRecords((prev) =>
        pageRef.current === 1 ? _list : [...prev, ..._list]
      );

      setCurrentPage(data.current_page);
      setHasMore(data.has_next_page);

      return data;
    } catch (err: any) {
      console.error("Failed to fetch records:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more records (for infinite scroll)
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    pageRef.current = pageRef.current + 1;
    await fetchRecords();
  }, [loading, hasMore, fetchRecords]);

  // Reset records state
  const resetRecords = useCallback(() => {
    pageRef.current = 1;
    setRecords([]);
    setHasMore(true);

    setCurrentPage(1);
  }, []);

  // Refresh records (fetch first page)
  const refreshRecords = useCallback(async () => {
    pageRef.current = 1;
    await fetchRecords();
  }, [fetchRecords]);

  const loadPage = useCallback(
    async (step: -1 | 1) => {
      pageRef.current = pageRef.current + step;
      await fetchRecords();
    },
    [fetchRecords]
  );

  useEffect(() => {
    if (userInfo?.user) {
      pageRef.current = 1;
      fetchRecords();
    }
  }, [userInfo?.user]);

  return {
    // Data
    records,
    currentPage,
    hasMore,
    loading,

    // Actions
    loadPage,
    fetchRecords,
    loadMore,
    resetRecords,
    refreshRecords
  };
}
