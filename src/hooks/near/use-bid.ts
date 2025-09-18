import axiosInstance from "@/libs/axios";
import { useState } from "react";
import { useAuth } from "@/contexts/auth";

export default function useBid(
  poolId: number,
  onSuccess: (result: any) => void
) {
  const [biding, setBiding] = useState(false);
  const { userInfo } = useAuth();

  const onBid = async (times: number) => {
    if (!userInfo?.address) return;
    setBiding(true);

    const random_seed = Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");

    const payload = {
      bets: times,
      deadline: Date.now() + 1000 * 60 * 60 * 24,
      game_id: poolId,
      nonce: 0,
      user_id: {
        Evm: userInfo.address.slice(2)
      }
    };
    try {
      const response = await axiosInstance.post(`/api/v1/user/bid/data`, {
        payload: JSON.stringify(payload),
        random_seed,
        user_signature: ""
      });
      console.log("response", response);
    } catch (error) {
      console.log(error);
    } finally {
      setBiding(false);
    }
  };

  return {
    biding,
    onBid
  };
}
