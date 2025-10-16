import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/libs/axios";
import { useAuth } from "@/contexts/auth";
import { getAnchorPrice } from "@/utils/pool";
import Big from "big.js";
import { formatNumber } from "@/utils/format/number";
import { useDebounceFn } from "ahooks";
import { useAllMarketsStore } from "@/stores/use-all-markets";
import { AMOUNT } from "@/config/btc";

export default function usePoolList(props?: {
  pageLimit?: number;
  isScrollList?: boolean;
  tokenStatus?: number;
  onFirstPageLoad?(list: any): void;
  volume?: number;
}) {
  const {
    pageLimit,
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
  const LIMIT =
    typeof pageLimit === "number"
      ? pageLimit
      : Math.floor(window.innerWidth / 300);

  const cachedList = useRef<any[]>([]);

  const onQueryPoolList = async (withoutLoading = false) => {
    // if (
    //   step === -1 ||
    //   step + pageRef.current < cachedList.current.length / LIMIT
    // ) {
    //   setPoolList(
    //     cachedList.current.slice(
    //       isScrollList ? 0 : (step + pageRef.current) * LIMIT,
    //       (step + pageRef.current + 1) * LIMIT
    //     )
    //   );
    //   setLoading(false);
    //   pageRef.current += step;

    //   setHasMore(
    //     step + pageRef.current < Math.ceil(cachedList.current.length / LIMIT)
    //   );
    //   return;
    // }
    // pageRef.current += step;

    try {
      clearTimeout(window.allMarketsTimer);
      // console.log("withoutLoading", withoutLoading);
      if (!withoutLoading) {
        setLoading(true);
        setPoolList([]);
      }
      const res = await axiosInstance.get(
        `/api/v1/pool/list?limit=${LIMIT}&offset=${
          pageRef.current * LIMIT
        }&sort_field=${sortField}&sort_order=${sortOrder}&status=${
          allmarketsStore.status
        }&chain=${"near"}&token_status=${tokenStatus}${
          collection?.address ? "&token=" + collection.address : ""
        }${volume ? "&volume=" + volume : ""}`
      );

      let market1: any = null;
      let market01: any = null;
      let market001: any = null;
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

        if (
          Number(_a) === AMOUNT[0] &&
          Big(item.accumulative_bids).gt(market1?.accumulative_bids || 0) &&
          Number(item.status) === 1
        ) {
          market1 = market;
        }
        if (
          Number(_a) === AMOUNT[1] &&
          Big(item.accumulative_bids).gt(market01?.accumulative_bids || 0) &&
          Number(item.status) === 1
        ) {
          market01 = market;
        }
        if (
          Number(_a) === AMOUNT[2] &&
          Big(item.accumulative_bids).gt(market001?.accumulative_bids || 0) &&
          Number(item.status) === 1
        ) {
          market001 = market;
        }
        return market;
      });

      if (!volume && allmarketsStore.status === "1") {
        allmarketsStore.set({
          hotMarkets: {
            "0": market1,
            "1": market01,
            "2": market001
          }
        });
      }

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
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    collection,
    setCollection,
    hasMore,
    pageRef,
    LIMIT
  };
}
