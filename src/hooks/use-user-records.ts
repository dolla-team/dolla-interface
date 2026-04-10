import axiosInstance from "@/libs/axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from '@/contexts/wallet'
import { useRequest } from "ahooks";
import Big from "big.js";
import useTokenPrice from "./use-token-price";

const LIMIT = 20;

export default function useUserRecords(props?: {
  isSinglePage?: boolean;
  pageLimit?: number;
}) {
  const { isSinglePage, pageLimit = LIMIT } = props ?? {};

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(0);
  const { userInfo } = useAuth();

  const onQueryRecords = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/v1/user/records?limit=${pageLimit}&offset=${
          pageRef.current * pageLimit
        }&chain=near`
      );

      setRecords((prev) =>
        pageRef.current === 0
          ? res.data.data.list
          : [...prev, ...res.data.data.list]
      );
      setHasMore(res.data.data.list.length === pageLimit);
      if (res.data.data.list.length === pageLimit) {
        pageRef.current++;
      }
    } catch (err) {
      console.error("Failed to fetch user records:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetRecords = () => {
    pageRef.current = 0;
    setRecords([]);
    setHasMore(true);
  };

  const [hasNextPage, setHasNextPage] = useState(true);
  const [userRecordsPageIndex, setUserRecordsPageIndex] = useState(1);
  const { data: userRecords, loading: userRecordsLoading } = useRequest(
    async () => {
      if (!userInfo?.user || !isSinglePage) {
        setUserRecordsPageIndex(1);
        return [];
      }
      try {
        const res = await axiosInstance.get(
          `/api/v1/user/records?limit=${pageLimit}&offset=${
            (userRecordsPageIndex - 1) * pageLimit
          }&chain=near`
        );

        setHasNextPage(res.data.data.has_next_page);
        const _list = res.data.data.list || [];
        return _list.map((item: any) => {
          item.typeName =
            UserRecordsTypeMap[item.type as EUserRecordsType]?.label;
          item.amountBig = Big(item.amount || 0).div(
            10 ** (item.token_info?.decimals || 6)
          );
          item.priceKey = `${item.token_info?.chain}:${item.token_info?.address}`;
          return item;
        });
      } catch (err) {
        console.error("Failed to fetch user records:", err);
      }
      return [];
    },
    {
      refreshDeps: [userRecordsPageIndex, userInfo]
    }
  );
  const onUserRecordsPageChange = (_page: number) => {
    setUserRecordsPageIndex(_page);
  };
  const userRecordsTokens = useMemo(() => {
    if (!userRecords) return [];
    const _tokens: any = new Map();
    userRecords.forEach((item: any) => {
      const _key = `${item.token_info?.chain}:${item.token_info?.address}`;
      if (_tokens.has(_key)) {
        return;
      }
      _tokens.set(_key, item.token_info);
    });
    return Array.from(_tokens.values());
  }, [userRecords]);
  const { prices: _userRecordsPrices, loading: userRecordsPricesLoading } =
    useTokenPrice(userRecordsTokens);
  const userRecordsPrices = useMemo(() => {
    if (!_userRecordsPrices) return {};
    const _prices: any = {};
    _userRecordsPrices.forEach((item: any) => {
      _prices[`${item.chain}:${item.address}`] = item.last_price;
    });
    return _prices;
  }, [_userRecordsPrices]);

  useEffect(() => {
    if (userInfo?.user && !isSinglePage) {
      pageRef.current = 0;
      onQueryRecords();
    }
  }, [userInfo?.user]);

  return {
    loading,
    records,
    hasMore,
    onQueryRecords,
    resetRecords,
    userRecords,
    userRecordsPrices,
    userRecordsLoading: userRecordsLoading,
    userRecordsPageIndex,
    hasNextPage,
    onUserRecordsPageChange
  };
}

export enum EUserRecordsType {
  Deposit = 1,
  Withdraw = 2,
  Refund = 3,
  Transfer = 4,
  LuckyDraw = 5
}

export const UserRecordsTypeMap = {
  [EUserRecordsType.Deposit]: {
    label: "Deposit"
  },
  [EUserRecordsType.Withdraw]: {
    label: "Withdraw"
  },
  [EUserRecordsType.Refund]: {
    label: "Refund"
  },
  [EUserRecordsType.Transfer]: {
    label: "Transfer"
  },
  [EUserRecordsType.LuckyDraw]: {
    label: "Lucky Draw"
  }
};
