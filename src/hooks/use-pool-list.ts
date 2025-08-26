import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/libs/axios";
import { HOST_API } from "@/config";
import { useAuth } from "@/contexts/auth";

export default function usePoolList(props?: {
  pageLimit?: number;
  isScrollList?: boolean;
  chain?: string;
  tokenStatus?: number;
  onFirstPageLoad?(list: any): void;
}) {
  const {
    pageLimit,
    isScrollList,
    onFirstPageLoad,
    chain = "Berachain",
    tokenStatus = 0
  } = props ?? {};

  const [poolList, setPoolList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortField, setSortField] = useState("time");
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
        `${HOST_API}/api/v1/pool/list?limit=${LIMIT}&offset=${
          pageRef.current * LIMIT
        }&sort_field=${sortField}&sort_order=${sortOrder}&status=1&chain=${
          chain || "Berachain"
        }&token_status=${tokenStatus}${
          collection?.address ? "&token=" + collection.address : ""
        }`
      );

      if (isScrollList) {
        setPoolList((prev) =>
          pageRef.current === 0
            ? res.data.data.list
            : [...prev, ...res.data.data.list]
        );
      } else {
        setPoolList(res.data.data.list);
      }
      if (pageRef.current === 0) {
        onFirstPageLoad?.(res.data.data.list);
      }

      cachedList.current =
        pageRef.current === 0
          ? res.data.data.list
          : [...cachedList.current, ...res.data.data.list];

      setHasMore(res.data.data.has_next_page);
      // if (res.data.data.list.length === LIMIT) {
      //   pageRef.current++;
      // }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.user) {
      pageRef.current = 0;
      cachedList.current = [];
      setPoolList([]);
      onQueryPoolList(0);
    }
  }, [userInfo, sortOrder, sortField, collection]);

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
