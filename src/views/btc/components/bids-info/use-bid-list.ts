import { useState, useEffect, useRef } from "react";
import axiosInstance from "@/libs/axios";
import { useDebounceFn } from "ahooks";
import useIsWindowVisible from "@/hooks/use-is-window-visible";
import { useBtcContext } from "../../context";

export default function useBidList() {
  const { pool } = useBtcContext();
  const [list, setList] = useState<any[]>([]);
  const [show, setShow] = useState(true);
  const [hasNext, setHasNext] = useState(true);
  const offset = useRef(0);
  const isVisible = useIsWindowVisible();

  const cachedList = useRef<any>([]);

  const loadMore = async () => {
    if (!pool?.pool_id) return;

    try {
      const res = await axiosInstance.get("/api/v1/bid/list", {
        params: {
          limit: 10,
          // id: 755,
          pool_id: pool.pool_id,
          offset: offset.current,
          chain: pool.chain
        }
      });

      if (res.data?.code !== 0) throw new Error();

      let newList: any = [];

      if (res.data?.data?.list?.length) {
        if (offset.current === 0) {
          newList = res.data.data.list;
          setShow(false);
          setTimeout(() => {
            setShow(true);
          }, 30);
        } else {
          newList = [...cachedList.current, ...res.data.data.list];
        }
      }
      const _more = res.data?.data?.has_next_page || false;

      cachedList.current = newList;

      setList(newList);
      clearTimeout((window as any).danmakuTimer);
      setHasNext(_more);
      if (_more) {
        offset.current = newList.length;
        (window as any).danmakuTimer = setTimeout(
          () => {
            loadMore();
          },
          _more ? 3000 : 10000
        );
      }
    } catch (err) {
      clearTimeout((window as any).danmakuTimer);
      (window as any).danmakuTimer = setTimeout(() => {
        loadMore();
      }, 10000);
    }
  };

  const { run: loadData } = useDebounceFn(
    () => {
      if (!pool?.pool_id) {
        return;
      }
      offset.current = 0;
      clearTimeout((window as any).danmakuTimer);
      loadMore();
    },
    { wait: 1000 }
  );

  useEffect(() => {
    if (!isVisible) {
      clearTimeout((window as any).danmakuTimer);
      return;
    }
    setList([]);

    loadData();
  }, [pool?.pool_id, isVisible]);

  useEffect(() => {
    return () => {
      clearTimeout((window as any).danmakuTimer);
    };
  }, []);

  return {
    list,
    show,
    hasNext
  };
}
