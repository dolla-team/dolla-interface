import { useAuth } from "@/contexts/auth";
import axiosInstance from "@/libs/axios";
import { useEffect, useState } from "react";

export default function useUserNft() {
  const [loading, setLoading] = useState(false);
  const [nfts, setNfts] = useState<any>([]);
  const { userInfo } = useAuth();

  const onQueryNfts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/user/nft?limit=${200}&sort_by=acquiredAt&sort_direction=desc&user=${
          userInfo?.user
        }`
      );
      setNfts(res.data.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.user) {
      onQueryNfts();
    }
  }, [userInfo]);

  return {
    loading,
    nfts,
    onQueryNfts
  };
}
