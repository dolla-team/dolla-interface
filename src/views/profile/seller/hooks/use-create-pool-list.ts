import axiosInstance from "@/libs/axios";
import { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/auth";
import { getPoolInfo } from "@/utils/pool";
import { useRequest } from "ahooks";
import useTokenPrice from "@/hooks/use-token-price";
import Big from "big.js";

const pageSize = 100;

export default function useCreatePoolList() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(0);
  const { userInfo } = useAuth();
  const poolsData = useRef<any>({});
  const mounted = useRef(false);
  const [poolsRefreshing, setPoolsRefreshing] = useState(false);

  const [recordsPageIndex, setRecordsPageIndex] = useState(1);
  const [recordsPageSize] = useState(10);
  const [recordsPageHasNextPage, setRecordsPageHasNextPage] = useState(true);

  const getCreatePoolList = async () => {
    clearTimeout(window.createMarketTimer);
    if (mounted.current) {
      setPoolsRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const response = await axiosInstance.get(
        `/api/v1/user/create/pool/list?limit=${pageSize}&offset=${
          pageRef.current * pageSize
        }&status=-1&chain=near`
      );
      const poolIds: number[] = [];
      response.data.data.list.forEach((item: any) => {
        if (item.status === 4) {
          return;
        }
        poolsData.current[item.pool_id] = item;
        poolIds.push(item.pool_id);
      });

      setData((prev) =>
        pageRef.current === 0 ? poolIds : [...prev, ...poolIds]
      );
      if (response.data.data.list.length < pageSize) {
        setHasMore(false);
      } else {
        pageRef.current = pageRef.current + 1;
      }
      mounted.current = true;
      window.createMarketTimer = setTimeout(() => {
        getCreatePoolList();
      }, 20000);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setPoolsRefreshing(false);
    }
  };

  const {
    runAsync: getRecords,
    loading: recordsLoading,
    data: records
  } = useRequest(
    async () => {
      if (!userInfo?.user) return [];
      try {
        const response = await axiosInstance.get(
          `/api/v1/user/records/seller?limit=${recordsPageSize}&chain=near&offset=${
            (recordsPageIndex - 1) * recordsPageSize
          }`
        );
        setRecordsPageHasNextPage(response.data.data.has_next_page);
        const _list = response.data.data.list || [];
        return _list.map((item: any) => {
          item.amountBig = Big(item.amount || 0).div(
            10 ** (item.token_info?.decimals || 6)
          );
          item.priceKey = `${item.token_info?.chain}:${item.token_info?.address}`;
          return item;
        });
      } catch (err: any) {
        console.log(err);
      }
      return [];
    },
    {
      refreshDeps: [recordsPageIndex, recordsPageSize, userInfo?.user]
    }
  );
  const recordsTokens = useMemo(() => {
    if (!records) return [];
    const _tokens: any = new Map();
    records.forEach((item: any) => {
      const _key = `${item.token_info?.chain}:${item.token_info?.address}`;
      if (_tokens.has(_key)) {
        return;
      }
      _tokens.set(_key, item.token_info);
    });
    return Array.from(_tokens.values());
  }, [records]);
  const { prices: _recordsPrices, loading: recordsPricesLoading } =
    useTokenPrice(recordsTokens);
  const recordsPrices = useMemo(() => {
    if (!_recordsPrices) return {};
    const _prices: any = {};
    _recordsPrices.forEach((item: any) => {
      _prices[`${item.chain}:${item.address}`] = item.last_price;
    });
    return _prices;
  }, [_recordsPrices]);

  const updatePoolsData = async (poolId: number, data?: any) => {
    if (data) {
      poolsData.current[poolId] = {
        ...poolsData.current[poolId],
        ...data
      };
    } else {
      const res = await getPoolInfo(poolId);
      poolsData.current[poolId] = res;
    }
  };

  const onRecordsPrevPage = () => {
    if (recordsPageIndex <= 1) {
      return;
    }
    setRecordsPageIndex((prev: any) => prev - 1);
  };

  const onRecordsNextPage = () => {
    if (!recordsPageHasNextPage) {
      return;
    }
    setRecordsPageIndex((prev: any) => prev + 1);
  };

  useEffect(() => {
    if (userInfo?.user) {
      getCreatePoolList();
    }
  }, [userInfo?.user]);

  useEffect(() => {
    return () => {
      clearTimeout(window.createMarketTimer);
    };
  }, []);

  return {
    data,
    loading,
    getCreatePoolList,
    updatePoolsData,
    poolsData: poolsData.current,
    hasMore,
    records,
    recordsLoading,
    onRecordsPrevPage,
    onRecordsNextPage,
    recordsPageIndex,
    recordsPageHasNextPage,
    getRecords,
    recordsPrices,
    recordsPricesLoading,
    poolsRefreshing
  };
}

export enum ESellerRecordsType {
  Created = 1,
  Claimed = 2,
  Refund = 3,
  Demage = 4
}
