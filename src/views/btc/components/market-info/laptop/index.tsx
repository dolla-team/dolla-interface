import Progress from "../progress";
import { useBtcContext } from "../../../context";
import { formatNumber } from "@/utils/format/number";
import clsx from "clsx";
import RollingDigitDisplay from "@/components/rolling-digit";
import Avatar from "@/components/avatar";
import SellerLevel from "@/components/seller-level";
import { formatAddress } from "@/utils/format/address";

export default function MarketInfo() {
  const { poolAmount, pool } = useBtcContext();

  return (
    pool?.status !== 2 && (
      <div className="absolute left-[20px] bottom-[24%] w-[244px]">
        <div className="flex items-center justify-between">
          <div className="h-[40px] flex items-center gap-[12px]">
            <div className="w-[39px] h-[39px] bg-linear-to-b from-[#FFC42F] to-[#99761C] rounded-[12px] p-[2px]">
              <Avatar
                size={35}
                address={pool?.user_info?.address}
                email={pool?.user_info?.email}
                className="rounded-[12px]"
              />
            </div>
            <div>
              <div className="flex items-center gap-[4px]">
                <span className="text-[14px] text-white">Seller</span>
                <SellerLevel />
              </div>
              <div className="">
                <span className="text-[14px] text-white">
                  {pool?.user ? formatAddress(pool.user) : "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center w-[282px] h-[74px] px-[16px] mt-[10px] rounded-[8px] bg-[#FFFFFF1A] backdrop-blur-[10px]">
          <div className="w-1/2">
            <div
              className={clsx(
                "text-[12px] flex items-center gap-[6px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-white/50"
              )}
            >
              <span>Players</span>
            </div>
            <div className={clsx("text-[20px] text-white")}>
              {pool?.participants || "-"}
            </div>
          </div>
          <div className="w-1/2">
            <div
              className={clsx(
                "text-[12px] flex items-center gap-[6px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-white/50"
              )}
            >
              <span>Bid</span>
            </div>
            <div className={clsx("text-[20px] text-white mt-[5px]")}>
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
        <div className="mt-[12px] flex items-center">
          <div className="w-1/2">
            <div
              className={clsx(
                "text-[12px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-white/50"
              )}
            >
              Market Size
            </div>
            <div
              className={clsx(
                "text-[16px] font-[600]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-white"
              )}
            >
              {poolAmount} BTC
            </div>
          </div>
          <div className="w-1/2">
            <div
              className={clsx(
                "text-[12px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-white/50"
              )}
            >
              Valued
            </div>
            <div
              className={clsx(
                "text-[16px] font-[600]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-white"
              )}
            >
              ${formatNumber(pool?.value, 0, true)}
            </div>
          </div>
        </div>

        <div className="mt-[14px]">
          <div
            className={clsx(
              "text-[12px]",
              pool?.status === 3 ? "text-[#C3C3C3]" : "text-white/50"
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
