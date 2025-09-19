import axiosInstance from "@/libs/axios";
import { useEffect, useState } from "react";

export default function useLucyDraw() {
  const [currentRound, setCurrentRound] = useState(0);
  const [participation, setParticipation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrentRound = async (id?: number) => {
    try {
      setIsLoading(true);
      let path = "/api/v1/ticket/lucky_draw";
      if (id) {
        path = `/api/v1/ticket/lucky_draw?id=${id}`;
      }
      const res = await axiosInstance.get(path);
      if (!id) {
        setCurrentRound(res.data.data.ticket_prize_draw.id);
      }
      setParticipation(res.data.data.ticket_prize_draw.number);
      setIsLoading(false);
      return {
        winningList: res.data.data.winning_list || [],
        number: res.data.data.ticket_prize_draw.number
      };
    } catch (error) {
      setIsLoading(false);
      return {
        winningList: [],
        number: 0
      };
    }
  };

  useEffect(() => {
    fetchCurrentRound();
  }, []);

  return {
    currentRound,
    participation,
    isLoading,
    fetchCurrentRound
  };
}
