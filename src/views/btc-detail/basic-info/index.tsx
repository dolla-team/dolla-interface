import { AMOUNT, BASE_TOKEN } from "@/config/btc";
import { useBtcContext } from "../../btc/context";
import BtcImg from "@/views/btc-list/markets/btc-bg";
import Avatar from "@/components/avatar";
import SellerLevel from "@/components/seller-level";
import { formatAddress } from "@/utils/format/address";
import dayjs from "@/libs/dayjs";
import { formatNumber } from "@/utils/format/number";
import BidsInfo from "../bids-info";
import SoldOut from "./sold-out";
import { formatRelativeTime } from '@/views/btc-list/markets/market'

export default function BasicInfo() {
  const { poolAmount, pool } = useBtcContext();
  const amountIndex = AMOUNT.indexOf(Number(poolAmount));
  return (
    <div className="w-full h-[270px] bg-white border border-[#E4E4E4] rounded-[20px] relative">
      <div className="flex gap-[20px] rounded-tl-[20px] bg-linear-to-r from-[#FFFFFF] to-[#FFFFFF00] from-40% to-100% relative z-[2] pt-[30px] pl-[30px]">
        <BtcImg
          index={amountIndex}
          id={pool?.pool_id}
          amount={poolAmount}
          className="scale-[2] origin-top-left"
        />
        <div className="ml-[60px]">
          <div className="text-[32px] font-bold leading-[90%]">
            {poolAmount} {BASE_TOKEN.symbol}
          </div>
          <div className="flex items-center gap-[11px] mt-[15px]">
            <Avatar
              size={32}
              address={pool?.user}
              src={pool?.user_info?.icon}
              className="text-[8px]"
            />
            <div className="text-[14px] text-[#8A87AA] leading-[90%]">
              <div>Lister</div>
              <div className="flex items-center gap-[4px] mt-[6px]">
                <span className="font-[500]">
                  {pool?.user_info?.name || formatAddress(pool?.user)}
                </span>
                <SellerLevel isSmall />
              </div>
            </div>
          </div>
          <div className="text-[14px] text-[#8A87AA] mt-[12px]">
            Listed: {dayjs(pool?.created_at).format('YYYY/MM/DD')} (
            {pool?.created_at
              ? formatRelativeTime(
                  pool?.created_at,
                  pool?.status === 1 ? dayjs() : pool.result_time
                )
              : '-'}
            )
          </div>
        </div>
      </div>
      {pool?.status === 1 && <BidsInfo />}
      {(pool?.status === 2 || pool?.status === 3) && <SoldOut pool={pool} />}
      <div className="mt-[50px] flex items-center pl-[30px]">
        <div className="w-1/3">
          <div className="text-[14px] text-black/60">Value</div>
          <div className="text-[20px] text-black font-[600]">
            ${formatNumber(pool?.reward_usd, 1, true)}
          </div>
        </div>
        <div className="w-[1px] h-[42px] bg-[#E4E4E4] mr-[30px]" />
        <div className="w-1/3">
          <div className="text-[14px] text-black/60">Volume</div>
          <div className="text-[20px] text-black font-[600]">
            ${formatNumber(pool?.accumulative_bids, 0, true)}
          </div>
        </div>
        <div className="w-[1px] h-[42px] bg-[#E4E4E4] mr-[30px]" />
        <div className="w-1/3">
          <div className="text-[14px] text-black/60">Bidders</div>
          <div className="text-[20px] text-black font-[600]">{pool?.participants}</div>
        </div>
      </div>
    </div>
  )
}
