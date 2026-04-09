import axiosInstance from "@/libs/axios";
import { useEffect, useState } from "react";
import { useAuth } from '@/contexts/wallet'
import useCancelledPoolsStore from "@/stores/use-cancelled-pools";

export default function useCancelledPools() {
  const { userInfo } = useAuth();
  const [currentPool, setCurrentPool] = useState<any>(null);
  const cancelledPoolsStore = useCancelledPoolsStore();

  const fetchCancelledPools = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/v1/user/joined_market?pool_status=3&limit=100&offset=0&chain=near`
      );

      const list = res.data?.data?.list.filter(
        (item: any) => item.status === 3 && !item.is_claim
      );

      cancelledPoolsStore.set({
        cancelledPools: list
      });
    } catch (err) {}
  };

  const getCurrentPool = () => {
    if (!cancelledPoolsStore.cancelledPools?.length) {
      setCurrentPool(null);
      return;
    }
    const pool = cancelledPoolsStore.cancelledPools?.[0];
    setCurrentPool(pool);
  };

  useEffect(() => {
    if (userInfo?.user) {
      fetchCancelledPools();
    } else {
      setCurrentPool(null);
    }
  }, [userInfo?.user]);

  useEffect(() => {
    getCurrentPool();
  }, [cancelledPoolsStore.cancelledPools]);

  return {
    currentPool,
    getCurrentPool
  };
}
