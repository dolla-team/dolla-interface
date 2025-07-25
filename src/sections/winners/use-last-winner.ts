import axiosInstance from "@/libs/axios";
import { useEffect, useRef, useState } from "react";
import useIsWindowVisible from "@/hooks/use-is-window-visible";

export default function useLastWinner() {
  const [lastWinner, setLastWinner] = useState<any>(null);
  const isVisible = useIsWindowVisible();
  const prevId = useRef<string | null>(null);

  const fetchLastWinner = async () => {
    try {
      const res = await axiosInstance.get(`/api/v1/pool/winner/bid/last`);
      if (res.data.data?.id !== prevId.current) {
        setLastWinner(null);
        prevId.current = res.data.data?.id;
        setTimeout(() => {
          setLastWinner(res.data.data);
        }, 1000);
      }
    } catch (err) {
    } finally {
      window.winnerTimer = setTimeout(() => {
        fetchLastWinner();
      }, 30000);
    }
  };

  useEffect(() => {
    if (!isVisible) {
      clearTimeout(window.winnerTimer);
      return;
    }
    fetchLastWinner();

    return () => {
      clearTimeout(window.winnerTimer);
    };
  }, [isVisible]);

  return {
    lastWinner
  };
}
