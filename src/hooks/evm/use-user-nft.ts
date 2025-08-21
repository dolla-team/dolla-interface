import axiosInstance from "@/libs/axios";
import { useEffect, useState } from "react";
import useNftsStore from "@/stores/use-nfts";

export default function useUserNft(userInfo: any) {
  const [loading, setLoading] = useState(false);
  const nftsStore = useNftsStore();

  const onQueryNfts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/api/v1/user/nft?limit=${200}&sort_by=acquiredAt&sort_direction=desc&user=${
          userInfo?.user
        }`
      );

      nftsStore.set({ nfts: res.data.data.tokens });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.user) {
      onQueryNfts();
    }
  }, [userInfo, nftsStore.refresher]);

  return {
    loading,
    nfts: nftsStore.nfts
  };
}
