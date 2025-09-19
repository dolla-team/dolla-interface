import axiosInstance from "@/libs/axios";
import { useEffect } from "react";
import useNftsStore from "@/stores/use-nfts";

export default function useUserNft(userInfo: any) {
  const nftsStore = useNftsStore();

  const onQueryNfts = async () => {
    try {
      nftsStore.set({ loading: true });
      const res = await axiosInstance.get(
        `/api/v1/user/nft?limit=${200}&sort_by=acquiredAt&sort_direction=desc&user=${
          userInfo?.user
        }`
      );

      nftsStore.set({ nfts: res.data.data?.tokens || [] });
    } catch (err) {
    } finally {
      nftsStore.set({ loading: false });
    }
  };

  useEffect(() => {
    if (userInfo?.user && nftsStore.refresher) {
      onQueryNfts();
    }
  }, [nftsStore.refresher]);
}
