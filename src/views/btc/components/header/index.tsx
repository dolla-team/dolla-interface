import clsx from "clsx";
import HeaderBg from "./bg";
import Light from "./light";
import { useBtcContext } from "../../context";
import { formatNumber } from "@/utils/format/number";
import { useMemo } from "react";
import Big from "big.js";

export default function Header({ className }: { className?: string }) {
  const { bids, pool } = useBtcContext();

  const [amount] = useMemo(() => {
    if (!pool) return ["0", 0, 0];
    const reward_amount = pool.reward_amount || 0;
    const decimals = pool.reward_token_info?.[0]?.decimals || 1;
    const _an = Big(
      Big(reward_amount)
        .div(10 ** decimals)
        .toFixed(3)
    );
    const _a = formatNumber(_an, 3, true);

    return [_a];
  }, [pool]);

  return (
    <div className={clsx("w-full relative", className)}>
      <HeaderBg className="absolute top-[0px] left-[0px] z-[2] pointer-events-none" />
      {bids === 1 && (
        <Light className="absolute top-[0px] left-[50%] translate-x-[-50%] z-[1] pointer-events-none" />
      )}
      <div className="absolute z-[3] top-[30px] left-[50%] translate-x-[-50%] h-[40px] flex items-center gap-[12px]">
        <span className="text-[#D9D9D9] text-[18px]">Market</span>
        <span
          className={clsx(
            "text-[18px] bg-clip-text",
            pool?.status === 3
              ? "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)]"
              : "bg-[linear-gradient(180deg,#FFF698_0%,#FFC42F_100%)]"
          )}
          style={{
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          {" "}
          #{pool?.pool_id}
        </span>
      </div>
      <div
        className={clsx(
          "absolute top-[70px] z-[2] w-full text-center font-[DelaGothicOne]",
          pool?.status === 3 ? "text-[#B2B2B2]" : "text-[#FFF79E]"
        )}
        style={{
          WebkitTextStrokeWidth: "1px",
          WebkitTextStrokeColor: pool?.status === 3 ? "#B2B2B2" : "#FFF79E"
        }}
      >
        <div
          className={clsx(
            "bg-clip-text relative inline-block text-[56px]",
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

          {/* {!!prev && (
            <div className="absolute left-[-180px] top-[-20px] flex items-center gap-[8px]">
              <TriIcon
                className="button"
                onClick={() => {
                  getPoolRecommend(prev * 10 ** BASE_TOKEN.decimals);
                  setFilterVolume(prev);
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
                  setFilterVolume(next);
                }}
              />
            </div>
          )} */}
        </div>
        <div />
        <div
          className={clsx(
            "bg-clip-text top-[-6px] inline-block relative",
            pool?.status === 3
              ? "bg-[radial-gradient(50%_50%_at_50%_50%,#A3A3A3_0%,#787878_100%)]"
              : "bg-[radial-gradient(50%_50%_at_50%_50%,#FFEF43_0%,#FFC42F_100%)]"
          )}
        >
          <span
            className="pad:text-[16px] text-[20px]"
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
