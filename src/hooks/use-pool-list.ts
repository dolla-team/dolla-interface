import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/libs/axios";
import { useAuth } from "@/contexts/auth";
import { getAnchorPrice } from "@/utils/pool";
import Big from "big.js";
import { formatNumber } from "@/utils/format/number";
import { useDebounceFn } from "ahooks";
import { useAllMarketsStore } from "@/stores/use-all-markets";

export default function usePoolList(props?: {
  isScrollList?: boolean;
  tokenStatus?: number;
  onFirstPageLoad?(list: any): void;
  volume?: number;
}) {
  const {
    isScrollList,
    onFirstPageLoad,
    tokenStatus = 0,
    volume = 0
  } = props ?? {};
  const allmarketsStore = useAllMarketsStore();
  const [poolList, setPoolList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("hitting");
  const [sortOrder, setSortOrder] = useState("desc");
  const [collection, setCollection] = useState<any>();
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(0);
  const { userInfo } = useAuth();

  const cachedList = useRef<any[]>([]);

  const onQueryPoolList = async (withoutLoading = false) => {
    try {
      clearTimeout(window.allMarketsTimer);
      // console.log("withoutLoading", withoutLoading);
      if (!withoutLoading) {
        setLoading(true);
        setPoolList([]);
      }
      const limit = allmarketsStore.status === "1" ? 20 : 10;
      const res = await axiosInstance.get(
        `/api/v1/pool/list?limit=${limit}&offset=${
          pageRef.current * limit
        }&sort_field=${sortField}&sort_order=${sortOrder}&status=${
          allmarketsStore.status
        }&chain=${"near"}&token_status=${tokenStatus}${
          collection?.address ? "&token=" + collection.address : ""
        }${volume ? "&volume=" + volume : ""}`
      );

      const list = res.data.data.list.map((item: any) => {
        const valued = item.nft_ids
          ? getAnchorPrice(item.anchor_price)
          : item.value;

        const reward_amount = item.reward_amount || 0;
        const decimals = item.reward_token_info?.[0]?.decimals || 1;
        const _an = Big(reward_amount).div(10 ** decimals);
        const _a = formatNumber(_an, 6, true);

        const market = {
          ...item,
          amount: _a,
          progress:
            Number(valued) === 0
              ? 0
              : Big(item.accumulative_bids).div(valued).mul(100).toNumber()
        };

        return market;
      });

      if (isScrollList) {
        setPoolList((prev) =>
          pageRef.current === 0 ? list : [...prev, ...list]
        );
      } else {
        setPoolList(list);
      }
      if (pageRef.current === 0) {
        onFirstPageLoad?.(list);
      }

      cachedList.current =
        pageRef.current === 0 ? list : [...cachedList.current, ...list];

      setHasMore(res.data.data.has_next_page);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      window.allMarketsTimer = setTimeout(() => {
        onQueryPoolList(true);
      }, 20000);
    }
  };

  const { run: onQueryPoolListDebounced } = useDebounceFn(
    () => {
      pageRef.current = 0;
      cachedList.current = [];
      setPoolList([]);
      onQueryPoolList();
    },
    {
      wait: 500
    }
  );

  // Load next page when available; keep current list intact
  const onNextPage = (step: number) => {
    if (loading) return; // guard to prevent duplicate loads
    pageRef.current += step;
    onQueryPoolList(true);
  };

  useEffect(() => {
    if (userInfo?.user) {
      onQueryPoolListDebounced();
    } else {
      setLoading(false);
    }
  }, [
    userInfo?.user,
    sortOrder,
    sortField,
    collection,
    volume,
    allmarketsStore.status
  ]);

  useEffect(() => {
    return () => {
      clearTimeout(window.allMarketsTimer);
    };
  }, []);

  useEffect(() => {
    if (allmarketsStore.status === "1") {
      setSortField("hitting");
    } else if (allmarketsStore.status === "2") {
      setSortField("winner_profit_ratio");
    }
  }, [allmarketsStore.status]);

  return {
    poolList,
    loading,
    onQueryPoolList,
    onNextPage,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    collection,
    setCollection,
    hasMore,
    pageRef
  };
}
