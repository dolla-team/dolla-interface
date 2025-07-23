import axiosInstance from "@/libs/axios";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import Big from "big.js";
import { useRequest } from "ahooks";
import { getPoolInfo } from "@/utils/pool";

const pageSize = 10;

export default function usePlayerHistory() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const { userInfo } = useAuth();
  const [hasMore, setHasMore] = useState(true);

  const [joinedPoolListData, setJoinedPoolListData] = useState<any>([]);
  const [joinedPoolListPageIndex, setJoinedPoolListPageIndex] = useState(1);
  const [joinedPoolListPageSize] = useState(10);
  const [joinedPoolListHasNextPage, setJoinedPoolListHasNextPage] = useState(true);
  const [joinedPoolListStatus, setJoinedPoolListStatus] = useState("");

  const { loading: joinedPoolListLoading } = useRequest(async () => {
    if (!userInfo?.user) return [];
    const url = new URL(window.location.href);
    url.searchParams.set("limit", joinedPoolListPageSize + "");
    url.searchParams.set("offset", (joinedPoolListPageIndex - 1) + "");
    url.searchParams.set("pool_status", joinedPoolListStatus);
    try {
      const response = await axiosInstance.get(`/api/v1/user/joined_market?${url.searchParams.toString()}`);
      setJoinedPoolListHasNextPage(response.data.data.has_next_page);
      response.data.data.list.forEach((item: any) => {
        item.participants = item.pool_info?.participants;
        item.accumulative_bids = item.pool_info?.accumulative_bids;
        item.anchor_price = item.pool_info?.anchor_price;
        item.value = item.pool_info?.value;
        item.is_claim = item.pool_info?.is_claim;
      });

      setJoinedPoolListData((prev: any) =>
        joinedPoolListPageIndex === 1 ? response.data.data.list : [...prev, ...response.data.data.list]
      );
    } catch (error) {
      console.log(error);
    }
  }, {
    refreshDeps: [joinedPoolListPageIndex, joinedPoolListPageSize, joinedPoolListStatus, userInfo]
  });

  const onJoinedPoolListPageChange = (_page: number) => {
    setJoinedPoolListPageIndex(_page);
  };

  const updateJoinedPoolListData = async (id: number, data?: any) => {
    const _joinedPoolListData = joinedPoolListData.slice();
    const curr = _joinedPoolListData.find((item: any) => item.id === id);
    if (!curr) return;
    if (!data) {
      data = await getPoolInfo(curr.pool_id);
    }
    for (const key in data) {
      curr[key] = data[key];
    }
    setJoinedPoolListData(_joinedPoolListData);
  };

  const onJoinedPoolListStatusChange = (status: string) => {
    setJoinedPoolListStatus(status);
    setJoinedPoolListPageIndex(1);
    setJoinedPoolListData([]);
  };

  const getRecords = async (_page: number) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/v1/user/player/history?limit=${pageSize}&offset=${
          (_page - 1) * pageSize
        }`
      );

      setData(
        response.data.data.list.map((item: any) => {
          return {
            ...item,
            purchase_amount: Big(item.purchase_amount || 0)
              .div(10 ** item.purchase_token_info.decimals)
              .toString(),
            rewardTokenInfo: item.reward_token_info?.[0] || {}
          };
        })
      );
      setHasMore(response.data.data.list.length === pageSize);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.user) {
      getRecords(1);
    }
  }, [userInfo]);

  const onPageChange = (_page: number) => {
    setPage(_page);
    setData([]);
    getRecords(_page);
  };

  return {
    page,
    data,
    loading,
    hasMore,
    onPageChange,

    joinedPoolListHasNextPage,
    joinedPoolListPageIndex,
    joinedPoolListLoading,
    joinedPoolListData,
    onJoinedPoolListPageChange,
    updateJoinedPoolListData,
    joinedPoolListStatus,
    onJoinedPoolListStatusChange,
  };
}
