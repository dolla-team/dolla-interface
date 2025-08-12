import { useMemo } from "react";
import useLastWinner from "./use-last-winner";
import WinnerCard from "./winner-card";
import Big from "big.js";
import MWinnerCard from "./m-winner-card";
import useIsMobile from "@/hooks/use-is-mobile";

export default function TopWinner() {
  const { lastWinner: data } = useLastWinner();
  const isMobile = useIsMobile();

  const [amount, rewardInfo, multiple] = useMemo(() => {
    if (!data) return ["", {}, 0];

    const _rewardInfo = data.reward_token_info[0];
    const _a = Big(data.reward_amount)
      .div(10 ** _rewardInfo.decimals)
      .toString();

    let lastBids = 0;
    data.bid_list?.forEach((item: any) => {
      if (item.is_winner) {
        lastBids = item.times;
      }
    });
    const _returnMultiple = lastBids
      ? Big(data?.reward_usd).div(lastBids).toFixed(0)
      : 0;

    return [_a, _rewardInfo, _returnMultiple];
  }, [data]);

  const params = {
    data,
    amount,
    rewardInfo,
    multiple
  };
  return isMobile ? (
    <MWinnerCard key={data?.pool_info?.winner_user} {...params} />
  ) : (
    <div className="absolute top-[14%] left-[20px]">
      <WinnerCard {...params} />
    </div>
  );
}
