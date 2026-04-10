import { ProbabilityInfo } from "@/views/btc/components/market-info/laptop";
import { BID_UNITS } from "@/config";
import { useBtcContext } from "@/views/btc/context";
import clsx from "clsx";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";
import { CreditsInfo } from "@/views/btc/components/bid-selection/laptop";
import Points from "@/sections/points";
import Button from "@/components/button";
import { formatNumber } from "@/utils/format/number";
import { getAnchorPrice } from "@/utils/pool";
import { useAuth } from '@/contexts/wallet'
import { useMemo } from 'react'
import Big from 'big.js'
import useLoginStore from '@/stores/use-login'

export default function Buy({
  disabled,
  balanceNotEnough,
  onBidClick
}: {
  disabled: boolean;
  balanceNotEnough: boolean;
  onBidClick: () => void;
}) {
  const { bids, setBids, pool, poolAmount, flipStatus } = useBtcContext();
  const { nearAccount } = useAuth();
  const wallet = useLoginStore(s => s.wallet)

  const probability = useMemo(() => {
    if (!pool?.anchor_price) return 0
    const anchorPrice = getAnchorPrice(pool?.anchor_price || 0)
    const _p = 1 - (1 - 1 / anchorPrice) ** bids
    return formatNumber(Big(Math.min(_p, 0.9999)).mul(100), 4, true)
  }, [pool?.anchor_price, bids])

  return (
    <div className="bg-white border border-[#E4E4E4] rounded-[20px] px-[30px] pb-[24px]">
      <div className="text-[16px] font-[600] text-black pt-[20px]">
        Bid for exposure to {poolAmount} {BASE_TOKEN.symbol}
      </div>
      <div className="flex items-center justify-between mt-[20px]">
        <div className="flex items-center gap-[4px]">
          <span className="text-[14px] text-black">Dolla Probability</span>
          <ProbabilityInfo />
        </div>
        <div className="text-[14px] text-black">≈ {probability}%</div>
      </div>
      <div className="flex items-center h-[62px] p-[6px] bg-[#0000000D] border border-[#F2F2F233] rounded-[16px] mt-[20px]">
        {BID_UNITS.map(item => (
          <button
            key={item}
            className={clsx(
              'button min-w-[50px] text-center h-[46px] rounded-[12px] text-[16px] text-black px-[30px] font-[700]',
              bids === item ? 'bg-[#FFC42F]' : ''
            )}
            onClick={() => {
              setBids(item)
            }}
          >
            ${item}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between text-[14px] text-black mt-[20px]">
        <span>Balance</span>
        <span>
          {formatNumber(
            wallet === 'near' ? nearAccount?.onlyQuoteBalance || 0 : nearAccount?.balance || 0,
            2,
            true
          )}{' '}
          {QUOTE_TOKEN.symbol}
        </span>
      </div>
      <div className="flex items-center justify-between text-[14px] text-black mt-[20px]">
        <div className="flex items-center gap-[6px]">
          <span>Credits</span>
          <CreditsInfo />
        </div>
        <div
          className="rounded-[12px] border border-[#E4E4E4] p-[8px]"
          style={{
            background:
              'linear-gradient(270deg, rgba(255, 196, 47, 0.00) 0%, rgba(255, 196, 47, 0.20) 100%), rgba(255, 255, 255, 0.60)',
          }}
        >
          <Points textClassName="!text-[14px] !text-black !font-[400]" />
        </div>
      </div>
      <Button
        disabled={disabled || balanceNotEnough}
        loading={flipStatus === 1}
        className={clsx(
          'w-full mt-[20px] h-[60px]  font-[700] rounded-[12px]',
          flipStatus === 2 ? '!bg-[#4CB100] text-white' : '!bg-[#FFC42F] text-black',
          balanceNotEnough || flipStatus === 2 ? '!text-[16px]' : '!text-[20px]'
        )}
        onClick={() => {
          if (disabled || balanceNotEnough) return
          onBidClick()
        }}
      >
        {balanceNotEnough
          ? 'Insufficient Balance'
          : flipStatus === 1
            ? 'Bidding'
            : flipStatus === 2
              ? 'Success'
              : 'Bid'}
      </Button>
    </div>
  )
}
