import axiosInstance from "@/libs/axios";
import { useEffect, useState } from "react";

export const usePoolDistributed = (data: any) => {
  const [distributed, setDistributed] = useState({
    1: 0,
    10: 0,
    50: 0,
    100: 0
  });
  const [loading, setLoading] = useState(false);

  const getDistributed = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/v1/pool/distributed?pool_id=${data.pool_id}&chain=${data.chain}`
      );
      const _result = {
        1: 0,
        10: 0,
        50: 0,
        100: 0
      };

      res.data.data.forEach((item: any) => {
        if (item.bid === 1) {
          _result[1] += item.number;
        } else if (item.bid === 10) {
          _result[10] += item.number;
        } else if (item.bid === 50) {
          _result[50] += item.number;
        } else if (item.bid === 100) {
          _result[100] += item.number;
        }
      });
      setDistributed(_result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data?.pool_id || data?.pool_id === 0) {
      getDistributed();
    }
  }, [data]);

  return { distributed, loading };
};
