import { useMemo } from "react";
import { useBtcContext } from "../btc/context";

export default function useShareData() {
  const { pool, poolAmount, winnerBidList } = useBtcContext();
  return useMemo(() => {
    if (!pool) return null;

    return {
      multiple: pool.winner_profit_ratio,
      time: pool.status === 2 ? pool.result_time : pool.created_at,
      bids: winnerBidList[winnerBidList.length - 1]?.times,
      amount: poolAmount,
      price: pool.reward_usd,
      winner_user: {
        name: pool.winner_user_info?.name,
        user: pool.winner_user_info?.user,
        icon: pool.winner_user_info?.icon,
        code: pool.winner_user_info?.code
      },
      user: {
        name: pool.user_info?.name,
        user: pool.user_info?.user,
        icon: pool.user_info?.icon,
        code: pool.user_info?.code
      },
      accumulative_bids: pool.accumulative_bids,
      status: pool.status,
      participants: pool.participants,
      reward_amount: pool.reward_amount,
      pool_id: pool.pool_id,
      anchor_price: pool.anchor_price
    };
  }, [pool, poolAmount, winnerBidList]);
}
