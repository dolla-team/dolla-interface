import Progress from "../progress";
import { useBtcContext } from "../../../context";
import { formatNumber } from "@/utils/format/number";
import clsx from "clsx";
import { PlayerIcon, BidsIcon } from "../icons";
import RollingDigitDisplay from "@/components/rolling-digit";
// import ShareBtn from "./share-btn";

export default function MarketInfo() {
  const { poolAmount, pool } = useBtcContext();

  return (
    pool?.status !== 2 && (
      <div className="absolute left-[20px] bottom-[24%] w-[244px]">
        <div className="flex items-center justify-between">
          <div>
            <span
              className="font-[DelaGothicOne] text-[20px]"
              style={{
                WebkitTextStroke:
                  pool?.status === 3 ? "1px #C3C3C3" : "1px #FFC42F"
              }}
            >
              Market{" "}
            </span>
            <span
              className={clsx(
                "font-[DelaGothicOne] text-[20px] bg-clip-text",
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
          {/* <ShareBtn /> */}
        </div>
        <div className="flex items-center w-[282px] h-[74px] px-[16px] mt-[10px] rounded-[8px] border border-[#3B3951] bg-[#FFFFFF1A] backdrop-blur-[10px]">
          <div className="w-1/2">
            <div
              className={clsx(
                "text-[16px] flex items-center gap-[6px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              <PlayerIcon />
              <span>Players</span>
            </div>
            <div
              className={clsx(
                "font-[DelaGothicOne] text-[26px] bg-clip-text",
                pool?.status === 3
                  ? "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)]"
                  : "bg-[linear-gradient(180deg,#FFF698_0%,#FFC42F_100%)]"
              )}
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {pool?.participants || "-"}
            </div>
          </div>
          <div className="w-1/2">
            <div
              className={clsx(
                "text-[16px] flex items-center gap-[6px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              <BidsIcon />
              <span>Bid</span>
            </div>
            <div
              className={clsx(
                "font-[DelaGothicOne] text-[26px] bg-clip-text",
                pool?.status === 3
                  ? "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)]"
                  : "bg-[linear-gradient(180deg,#FFF698_0%,#FFC42F_100%)]"
              )}
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {pool?.status !== 3 ? (
                <RollingDigitDisplay
                  prefixSymbol="$"
                  value={String(pool?.accumulative_bids || 0)}
                />
              ) : (
                `$${formatNumber(pool?.accumulative_bids || 0, 0, true)}`
              )}
            </div>
          </div>
        </div>
        <div className="mt-[8px] flex items-center">
          <div className="w-1/2">
            <div
              className={clsx(
                "text-[16px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              Market Size
            </div>
            <div
              className={clsx(
                "font-[BlackHanSans] text-[18px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              {poolAmount} BTC
            </div>
          </div>
          <div className="w-1/2">
            <div
              className={clsx(
                "text-[16px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              Valued
            </div>
            <div
              className={clsx(
                "font-[BlackHanSans] text-[18px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              ${formatNumber(pool?.reward_usd, 0, true)}
            </div>
          </div>
        </div>

        <div className="mt-[8px]">
          <div
            className={clsx(
              "text-[16px]",
              pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
            )}
          >
            Total Bid
          </div>
          <div className="mt-[10px]">
            <Progress data={pool} />
          </div>
        </div>
      </div>
    )
  );
}
