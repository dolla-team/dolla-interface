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

const DEFAULT_LIMIT = 9

export default function useUserPoolBids(params: UseUserPoolBidsParams) {
  const { chain, pool_id, limit = DEFAULT_LIMIT } = params
  const [bids, setBids] = useState<UserPoolBid[]>([])
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  // Calculate offset from page
  const offset = (page - 1) * limit

  const fetchUserPoolBids = useCallback(async () => {
    if (!pool_id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)

      const queryParams = new URLSearchParams({
        chain,
        limit: limit.toString(),
        offset: offset.toString(),
        pool_id: pool_id.toString(),
      })

      const res = await axiosInstance.get(`/api/v1/user/pool/bids?${queryParams.toString()}`)

      const bidsList = res.data?.data?.list || []
      const hasNextPage = res.data?.data?.has_next_page ?? bidsList.length === limit

      setBids(bidsList)
      setHasMore(hasNextPage)
    } catch (error) {
      console.error('Failed to fetch user pool bids:', error)
      setBids([])
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [chain, pool_id, limit, offset])

  // Reset page when pool_id changes
  useEffect(() => {
    setPage(1)
  }, [pool_id])

  useEffect(() => {
    if (pool_id) {
      fetchUserPoolBids()
    }
  }, [pool_id, page, fetchUserPoolBids])

  // Go to specific page
  const goToPage = useCallback(
    (targetPage: number) => {
      if (targetPage >= 1 && !loading) {
        setPage(targetPage)
      }
    },
    [loading]
  )

  return {
    bids,
    loading,
    page,
    hasMore,
    goToPage,
    refetch: fetchUserPoolBids,
  }
}
