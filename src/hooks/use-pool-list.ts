import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/libs/axios";
import { useAuth } from "@/contexts/auth";
import { getAnchorPrice } from "@/utils/pool";
import Big from "big.js";
import { formatNumber } from "@/utils/format/number";
import { useDebounceFn } from "ahooks";
import usePoolListStore from "@/stores/use-pool-list";

export default function usePoolList(props?: {
  pageLimit?: number;
  isScrollList?: boolean;
  tokenStatus?: number;
  onFirstPageLoad?(list: any): void;
}) {
  const {
    pageLimit,
    isScrollList,
    onFirstPageLoad,
    tokenStatus = 0
  } = props ?? {};
  const poolListStore = usePoolListStore();

  const [poolList, setPoolList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("hitting");
  const [sortOrder, setSortOrder] = useState("desc");
  const [collection, setCollection] = useState<any>();
  const [volume, setVolume] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(0);
  const { userInfo } = useAuth();
  const LIMIT =
    typeof pageLimit === "number"
      ? pageLimit
      : Math.floor(window.innerWidth / 300);

  const cachedList = useRef<any[]>([]);

  const onQueryPoolList = async (step: number) => {
    if (
      step === -1 ||
      step + pageRef.current < cachedList.current.length / LIMIT
    ) {
      setPoolList(
        cachedList.current.slice(
          isScrollList ? 0 : (step + pageRef.current) * LIMIT,
          (step + pageRef.current + 1) * LIMIT
        )
      );
      setLoading(false);
      pageRef.current += step;

      setHasMore(
        step + pageRef.current < Math.ceil(cachedList.current.length / LIMIT)
      );
      return;
    }
    pageRef.current += step;
    if (!isScrollList) {
      setPoolList([]);
    }
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/v1/pool/list?limit=${LIMIT}&offset=${
          pageRef.current * LIMIT
        }&sort_field=${sortField}&sort_order=${sortOrder}&status=1&chain=${"near"}&token_status=${tokenStatus}${
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
        const _a = formatNumber(_an, 3, true);

        const market = {
          ...item,
          amount: _a,
          progress:
            Number(valued) === 0
              ? 0
              : Big(item.accumulative_bids).div(valued).mul(100).toNumber()
        };

        if (_a === "1" && Big(_a).gt(market1?.amount || 0)) {
          market1 = market;
        }
        if (_a === "0.1" && Big(_a).gt(market01?.amount || 0)) {
          market01 = market;
        }
        if (_a === "0.01" && Big(_a).gt(market001?.amount || 0)) {
          market001 = market;
        }
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

      poolListStore.set({
        hotMarkets: {
          "1": market1,
          "0.1": market01,
          "0.01": market001
        }
      });

      cachedList.current =
        pageRef.current === 0 ? list : [...cachedList.current, ...list];

      setHasMore(res.data.data.has_next_page);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const { run: onQueryPoolListDebounced } = useDebounceFn(
    () => {
      pageRef.current = 0;
      cachedList.current = [];
      setPoolList([]);
      onQueryPoolList(0);
    },
    {
      wait: 500
    }
  );

  useEffect(() => {
    if (userInfo?.user) {
      onQueryPoolListDebounced();
    }
  }, [userInfo?.user, sortOrder, sortField, collection, volume]);

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
    volume,
    setVolume,
    hasMore,
    pageRef,
    LIMIT
  };
}
