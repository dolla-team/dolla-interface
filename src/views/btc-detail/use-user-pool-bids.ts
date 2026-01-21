import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/libs/axios";

interface UseUserPoolBidsParams {
  chain: string;
  pool_id: number;
  limit?: number;
  offset?: number;
}

interface UserPoolBid {
  [key: string]: any;
}

const DEFAULT_LIMIT = 100;
const DEFAULT_OFFSET = 0;

export default function useUserPoolBids(params: UseUserPoolBidsParams) {
  const {
    chain,
    pool_id,
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET
  } = params;
  const [bids, setBids] = useState<UserPoolBid[]>([]);
  const [totalTimes, setTotalTimes] = useState(0);
  const [totalBids, setTotalBids] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUserPoolBids = useCallback(async () => {
    if (!pool_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        chain,
        limit: limit.toString(),
        offset: offset.toString(),
        pool_id: pool_id.toString()
      });

      const res = await axiosInstance.get(
        `/api/v1/user/pool/bids?${queryParams.toString()}`
      );

      const bidsList = res.data?.data?.list || [];
      let _bids = 0;
      bidsList.forEach((item: any) => {
        _bids += item.times;
      });
      setTotalBids(_bids);
      setTotalTimes(bidsList?.length || 0);
      setBids(bidsList);
    } catch (error) {
      console.error("Failed to fetch user pool bids:", error);
      setBids([]);
    } finally {
      setLoading(false);
    }
  }, [chain, pool_id, limit, offset]);

  useEffect(() => {
    if (pool_id) {
      fetchUserPoolBids();
    }
  }, [pool_id]);

  return {
    bids,
    totalBids,
    totalTimes,
    loading,
    refetch: fetchUserPoolBids
  };
}
