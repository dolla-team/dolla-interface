import axiosInstance from "@/libs/axios";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/auth";

export default function useUserWinnerList() {
  const { userInfo } = useAuth();
  const listRef = useRef<any>(null);
  const [currentWinner, setCurrentWinner] = useState<any>(null);

  const fetchUserWinnerList = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/user/ticket/winning/list?claim=true&limit=100&offset=0`
      );

      const map: any = {};

      res.data.data.list.forEach((item: any) => {
        if (!map[item.prize_draw_id]) {
          map[item.prize_draw_id] = {
            volume: Number(item.volume),
            ids: [item.id],
            prize_draw_id: item.prize_draw_id
          };
        } else {
          map[item.prize_draw_id].volume += Number(item.volume);
          map[item.prize_draw_id].ids.push(item.id);
        }
      });

      listRef.current = Object.values(map);
      getCurrentWinner();
    } catch (err) {}
  };

  const getCurrentWinner = () => {
    if (!listRef.current?.length) {
      setCurrentWinner(null);
      return;
    }
    const winner = listRef.current.pop();
    setCurrentWinner(winner);
  };

  useEffect(() => {
    if (userInfo?.user) {
      fetchUserWinnerList();
    } else {
      setCurrentWinner(null);
    }
  }, [userInfo?.user]);

  return {
    currentWinner,
    getCurrentWinner
  };
}
