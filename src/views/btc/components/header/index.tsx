import clsx from "clsx";
import HeaderBg from "./bg";
import Light from "./light";
import { useBtcContext } from "../../context";
import { formatNumber } from "@/utils/format/number";
import { useMemo } from "react";
import Big from "big.js";
import TriIcon from "./tri-icon";
import { BASE_TOKEN } from "@/config/btc";

export default function Header({ className }: { className?: string }) {
  const { bids, pool, getPoolRecommend } = useBtcContext();

  const [amount, prev, next] = useMemo(() => {
    if (!pool) return ["0", 0, 0];
    const reward_amount = pool.reward_amount || 0;
    const decimals = pool.reward_token_info?.[0]?.decimals || 1;
    const _an = Big(reward_amount).div(10 ** decimals);
    const _a = formatNumber(_an, 3, true);
    let prev = 0;
    let next = 0;
    if (_an.eq(0.001)) {
      prev = 0;
      next = 0.01;
    } else if (_an.eq(0.01)) {
      prev = 0.001;
      next = 0.1;
    } else if (_an.eq(0.1)) {
      prev = 0.01;
      next = 1;
    } else if (_an.eq(1)) {
      prev = 0.1;
      next = 0;
    } else if (_an.lt(0.001)) {
      prev = 0;
      next = 0.001;
    } else if (_an.gt(1)) {
      prev = 1;
      next = 0;
    }
    return [_a, prev, next];
  }, [pool]);

  return (
    <div className={clsx("w-full relative", className)}>
      <HeaderBg className="absolute top-[0px] left-[0px] z-[2] pointer-events-none" />
      {bids === 1 && (
        <Light className="absolute top-[0px] left-[50%] translate-x-[-50%] z-[1] pointer-events-none" />
      )}
      <div
        className={clsx(
          "absolute top-[76px] z-[2] w-full text-center font-[DelaGothicOne]",
          pool?.status === 3 ? "text-[#B2B2B2]" : "text-[#FFF79E]"
        )}
        style={{
          WebkitTextStrokeWidth: "1px",
          WebkitTextStrokeColor: pool?.status === 3 ? "#B2B2B2" : "#FFF79E"
        }}
      >
        <div
          className={clsx(
            "bg-clip-text relative inline-block text-[62px]",
            pool?.status === 3
              ? "bg-[radial-gradient(50%_50%_at_50%_50%,#C3C3C3_0%,#787878_100%)]"
              : "bg-[radial-gradient(50%_50%_at_50%_50%,#FFEF43_0%,#FFC42F_100%)]"
          )}
        >
          <span
            style={{
              WebkitTextFillColor: "transparent"
            }}
          >
            ${formatNumber(pool?.value, 0, true)}
          </span>
          {!!prev && (
            <div className="absolute left-[-180px] top-[-20px] flex items-center gap-[8px]">
              <TriIcon
                className="button"
                onClick={() => {
                  getPoolRecommend(prev * 10 ** BASE_TOKEN.decimals);
                }}
              />
              <span className="text-[20px] text-[#FFEF43]">{prev} BTC</span>
            </div>
          )}
          {!!next && (
            <div className="absolute right-[-180px] top-[-20px] flex items-center gap-[8px]">
              <span className="text-[20px] text-[#FFEF43]">{next} BTC</span>
              <TriIcon
                className="rotate-y-[180deg] button"
                onClick={() => {
                  getPoolRecommend(next * 10 ** BASE_TOKEN.decimals);
                }}
              />
            </div>
          )}
        </div>
        <div />
        <div
          className={clsx(
            "bg-clip-text mt-[-8px] inline-block relative text-[26px]",
            pool?.status === 3
              ? "bg-[radial-gradient(50%_50%_at_50%_50%,#A3A3A3_0%,#787878_100%)]"
              : "bg-[radial-gradient(50%_50%_at_50%_50%,#FFEF43_0%,#FFC42F_100%)]"
          )}
        >
          <span
            style={{
              WebkitTextFillColor: "transparent"
            }}
          >
            1 DOLLA FOR {amount} BTC
          </span>
        </div>
      </div>
    </div>
  );
}
