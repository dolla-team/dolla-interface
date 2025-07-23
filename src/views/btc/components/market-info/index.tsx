import Progress from "./progress";
import { useBtcContext } from "../../context";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import { formatAddress } from "@/utils/format/address";
import { useMemo } from "react";
import Avatar from "@/components/avatar";
import clsx from "clsx";

export default function MarketInfo() {
  const { pool } = useBtcContext();

  const [amount] = useMemo(() => {
    if (!pool) return ["0"];
    const reward_amount = pool.reward_amount || 0;
    const decimals = pool.reward_token_info?.[0]?.decimals || 1;
    const _a = formatNumber(Big(reward_amount).div(10 ** decimals), 3, true);
    return [_a];
  }, [pool]);

  return (
    pool?.status !== 2 && (
      <div className="absolute left-[20px] bottom-[24%] w-[244px]">
        <div className="flex items-center gap-[50px]">
          <div className="flex items-center gap-[8px]">
            <Avatar
              address={pool?.user}
              email={pool?.user_info?.email}
              size={32}
              className="border border-[2px] border-white/40"
            />
            <div>
              <div className="text-[#FFE9B2] text-[12px]">Provider</div>
              <div className="text-white text-[14px]">
                {pool?.user ? formatAddress(pool.user) : "-"}
              </div>
            </div>
          </div>
          <div>
            <div className="text-[#FFE9B2] text-[12px]">Players</div>
            <div className="text-white text-[14px]">
              {pool?.participants || "-"}
            </div>
          </div>
          <div>
            <div className="text-[#FFE9B2] text-[12px]">Bid</div>
            <div className="text-white text-[14px]">
              {pool?.accumulative_bids || "-"}
            </div>
          </div>
        </div>
        <div className="mt-[28px] font-[BlackHanSans]">
          <div className="text-[#B9B9B9] text-[14px]">GRAND</div>
          <div
            className={clsx(
              "font-[DelaGothicOne] mt-[-8px] text-[36px] bg-clip-text",
              pool?.status === 3
                ? "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)]"
                : "bg-[linear-gradient(180deg,#FFF698_0%,#FFC42F_100%)]"
            )}
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            {amount} BTC
          </div>
        </div>
        <div className="mt-[18px] font-[BlackHanSans]">
          <div className="text-[#B9B9B9] text-[14px]">Valued</div>
          <div
            className={clsx(
              "font-[DelaGothicOne] mt-[-8px] text-[36px] bg-clip-text",
              pool?.status === 3
                ? "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)]"
                : "bg-[linear-gradient(180deg,#FFF698_0%,#FFC42F_100%)]"
            )}
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            ${formatNumber(pool?.value, 0, true)}
          </div>
        </div>
        <Progress data={pool} />
      </div>
    )
  );
}
