import { BASE_TOKEN } from "@/config/btc";
import Market from "@/views/profile/components/market";
import dayjs from "@/libs/dayjs";
import { getSpilledAmount } from "@/utils/pool";
import { useMemo } from "react";
import clsx from "clsx";
import { formatNumber } from "@/utils/format/number";

export default function PoolMarket({ data }: any) {
  const pool = useMemo(() => {
    return {
      accumulative_bids: data.accumulative_bids,
      anchor_price: data.anchor_price,
      reward_amount: data.reward_amount,
      reward_token_info: [
        {
          decimals: BASE_TOKEN.decimals,
          symbol: BASE_TOKEN.symbol
        }
      ],
      pool_id: data.pool_id,
      pool_user_info: data.user,
      status: data.status,
      participants: data.participants
    };
  }, [data]);
  const [progress, spilled, spilledPercent] = useMemo(() => {
    return getSpilledAmount(pool);
  }, [pool]);

  return (
    <Market
      data={pool}
      from="share"
      footer={
        <>
          <div
            className={clsx(
              "mt-[10px] rounded-[6px] relative mx-[11px] flex",
              "h-[3px] bg-[#0000001A] w-[278px]"
            )}
          >
            <div
              className="h-full rounded-[10px]"
              style={{
                background:
                  "linear-gradient(90deg, #FFE9B2 0%, #FFC42F 54.81%, #F88E51 100%)",
                width: `${Math.min(
                  spilled > 0 ? 100 - spilledPercent : progress,
                  100
                )}%`
              }}
            />
            {spilled > 0 && (
              <div
                className="h-full rounded-[10px]"
                style={{
                  background: "linear-gradient(90deg, #C637FF 0%,#FFADCF 100%)",
                  width: `${Math.min(spilledPercent, 100)}%`
                }}
              />
            )}
          </div>
          <div className="justify-between items-center flex mt-[10px] w-full h-[50px] px-[13px] bg-black rounded-b-[16px]">
            <span className="text-[#8A87AA] text-[10px]">
              {dayjs().format("HH:mm D MMM, YYYY")}
            </span>
            {spilled > 0 && (
              <div className="text-right">
                <div
                  className="text-[16px] font-[600]"
                  style={{
                    background:
                      "linear-gradient(90deg, #C637FF 0%, #FFADCF 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  {formatNumber(spilled, 2, true, {
                    isShort: true,
                    prefix: "$"
                  })}
                </div>
                <div className="text-[10px] text-[#8A87AA] mt-[-2px]">
                  Overfilled
                </div>
              </div>
            )}
          </div>
        </>
      }
      className="w-[301px] h-[171px] mt-[10px] !border-none shadow-[0_0_30px_#FFB700]"
    />
  );
}
