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

export default function useRecords(isScroll?: boolean) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const pageRef = useRef(0);
  const { userInfo, address } = useAuth();
  // Fetch records with pagination (infinite scroll style)
  const fetchRecords = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get<RecordsResponse>(
        "/api/v1/account_records",
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
        let tokens: any[] = [];
        let businessType = "";

        if (item.type === "swap") {
          tokens =
            item.assets?.[0] === BASE_TOKEN.address
              ? [BASE_TOKEN, QUOTE_TOKEN]
              : [QUOTE_TOKEN, BASE_TOKEN];
        } else if (item.type === "deposit") {
          tokens = item.to.includes(BASE_TOKEN.address)
            ? [BASE_TOKEN]
            : [QUOTE_TOKEN];
        } else if (item.type === "withdraw") {
          tokens = item.from.includes(BASE_TOKEN.address)
            ? [BASE_TOKEN]
            : [QUOTE_TOKEN];
        } else {
          tokens =
            item.assets === BASE_TOKEN.address ? [BASE_TOKEN] : [QUOTE_TOKEN];
        }
        if (item.source === "CHAINDEFUSER") {
          businessType = item.type.charAt(0).toUpperCase() + item.type.slice(1);
        } else if (item.source === "TICKET") {
          businessType = "Lucky Draw";
        } else if (item.source === "CLAIM") {
          businessType = "Claim";
        } else if (item.source === "KOL_REWARD") {
          businessType = "Profit Share";
        }

        let status = item.status;
        if (item.status === "SUCCESS") {
          status = "Success";
        } else if (item.status === "FAILED") {
          status = "Failed";
        } else if (item.status === "REFUNDED") {
          status = "Refunded";
        } else if (item.status === "CLAIMABLE") {
          status = "Claimable";
        } else if (item.status === "CLAIMAING") {
          status = "Claiming";
        } else {
          status = "Processing";
        }

        return {
          type: item.type,
          business_type: businessType,
          tokens,
          amount: item.amount,
          id: item.id,
          updated_at: item.date,
          status
        };
      });

      // Update records based on whether it's a new fetch or load more
      if (isScroll) {
        setRecords([...records, ..._list]);
      } else {
        setRecords(_list);
      }

      setHasMore(data.has_next_page);

      return data;
    } catch (err: any) {
      console.error("Failed to fetch records:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load more records (for infinite scroll)
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    pageRef.current = pageRef.current + 1;
    setCurrentPage(pageRef.current);
    await fetchRecords();
  }, [loading, hasMore, fetchRecords]);

  // Reset records state
  const resetRecords = useCallback(() => {
    pageRef.current = 1;
    setCurrentPage(1);
    setRecords([]);
    setHasMore(true);
  }, []);

  // Refresh records (fetch first page)
  const refreshRecords = useCallback(async () => {
    pageRef.current = 1;
    setCurrentPage(1);
    await fetchRecords();
  }, [fetchRecords]);

  const loadPage = useCallback(
    async (step: -1 | 1) => {
      pageRef.current = pageRef.current + step;
      setCurrentPage(pageRef.current);
      await fetchRecords();
    },
    [fetchRecords]
  );

  useEffect(() => {
    if (userInfo?.user) {
      pageRef.current = 1;
      setCurrentPage(1);
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
