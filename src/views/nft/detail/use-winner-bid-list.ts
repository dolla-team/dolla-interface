import axiosInstance from "@/libs/axios";
import { useEffect, useState } from "react";

export default function useWinnerBidList(data: any) {
  const [winnerBidList, setWinnerBidList] = useState<any[]>([]);
  const queryWinnerBidList = async () => {
    const res = await axiosInstance.get(
      `/api/v1/pool/winner/bid/list?chain=${data.chain}&pool_id=${data.pool_id}`
    );

    setWinnerBidList(res.data.data);
  };

  useEffect(() => {
    if (data.pool_id) {
      queryWinnerBidList();
    }
  }, [data]);

  return {
    winnerBidList
  };
}
