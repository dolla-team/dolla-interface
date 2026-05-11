import { useMemo } from 'react'
import Big from 'big.js'
import { useAuth } from '@/contexts/wallet'
import useTokenPrice from '@/hooks/use-token-price'
import useClaimNear from '@/hooks/near/use-claim-near'
import useNearChainOnlyPrizeBalance from '@/hooks/near/use-only-prize-balance-near'
import { BASE_TOKEN, QUOTE_TOKEN } from '@/config/btc'
import { formatNumber } from '@/utils/format/number'
import clsx from 'clsx'
import Button from '@/components/button'

function AssetCard({
  symbol,
  icon,
  priceUsd,
  balance,
  balanceDecimals,
}: {
  symbol: string
  icon: string
  priceUsd: number
  balance: string
  balanceDecimals: number
}) {
  const usd = Big(balance || 0).mul(priceUsd || 0).toNumber()

  return (
    <div className="flex h-[53px] w-full max-w-[286px] items-center justify-between rounded-[10px] bg-white px-3">
      <div className="flex min-w-0 items-center gap-2">
        <img src={icon} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
        <div className="min-w-0">
          <div className="font-[Unbounded] text-[14px] text-black">{symbol}</div>
          <div className="font-[Unbounded] text-[10px] text-[#8A87AA]">
            ${formatNumber(priceUsd, 2, true)}
          </div>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="font-[Unbounded] text-[14px] text-black">
          {formatNumber(balance || 0, balanceDecimals, true)}
        </div>
        <div className="font-[Unbounded] text-[10px] text-[#8A87AA]">${formatNumber(usd, 2, true)}</div>
      </div>
    </div>
  )
}

export default function NearWalletPanel({ className }: { className?: string }) {
  const { nearAccount, updateNearAccount, accountId } = useAuth()
  const { onlyPrizeBalance: walletBase } = useNearChainOnlyPrizeBalance(
    typeof accountId === 'string' ? accountId : undefined
  )

  const { claim, claimLoading } = useClaimNear(() => {
    void updateNearAccount()
  })

  const tokenIds = useMemo(
    () => [
      { chain: 'near', address: QUOTE_TOKEN.address },
      { chain: 'near', address: BASE_TOKEN.address },
    ],
    []
  )
  const { prices } = useTokenPrice(tokenIds)
  const usdtPrice = prices[0]?.last_price ?? 1
  const basePrice = prices[1]?.last_price ?? 1

  const walletUsdt = nearAccount?.onlyQuoteBalance ?? '0'
  const internalUsdt = nearAccount?.balance ?? '0'
  const internalBase = nearAccount?.prizeBalance ?? '0'

  const dollaWinningUsd = useMemo(
    () =>
      Big(internalUsdt || 0)
        .mul(usdtPrice || 0)
        .plus(Big(internalBase || 0).mul(basePrice || 0))
        .toNumber(),
    [internalUsdt, internalBase, usdtPrice, basePrice]
  )

  const hasClaimable = useMemo(() => Big(internalUsdt || 0).gt(0) || Big(internalBase || 0).gt(0), [internalUsdt, internalBase])

  return (
    <div className={clsx('relative w-[319px] select-none', className)}>
      <img
        src="/near-wallet-woman.png"
        alt=""
        className="pointer-events-none absolute -top-[45px] left-3 z-[1] h-[45px] w-[81px] object-cover"
        width={81}
        height={45}
      />
      <div
        className={clsx(
          'relative rounded-[10px] border border-[#FFC42F] bg-[#FFF9E9]',
          'w-[318px] pb-4 pt-3'
        )}
      >
        <div className="px-4">
          <div className="flex items-end justify-between gap-2">
            <span className="font-[Bungee] text-[20px] tracking-[-0.05em] text-black">BIDDER</span>
            <span className="font-[Unbounded] text-[18px] font-bold text-black">
              ${formatNumber(dollaWinningUsd, 2, true)}
            </span>
          </div>
          <p className="mt-1 font-[Unbounded] text-[12px] text-[#8A87AA]">
            Not supported by nearwallet for Sellers
          </p>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="font-[Unbounded] text-[12px] text-[#8A87AA]">Dolla Winning</span>
            <span className="font-[Unbounded] text-[12px] text-[#8A87AA]">1Bid = 1 USDT</span>
          </div>

          <div className="mt-2 flex flex-col gap-2">
            <AssetCard
              symbol={QUOTE_TOKEN.symbol}
              icon={QUOTE_TOKEN.icon}
              priceUsd={usdtPrice}
              balance={internalUsdt}
              balanceDecimals={QUOTE_TOKEN.decimals > 6 ? 6 : 2}
            />
            <AssetCard
              symbol={BASE_TOKEN.symbol}
              icon={BASE_TOKEN.icon}
              priceUsd={basePrice}
              balance={internalBase}
              balanceDecimals={BASE_TOKEN.decimals > 6 ? 6 : 4}
            />
          </div>

          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              isPrimary={false}
              disabled={claimLoading || !hasClaimable}
              onClick={() => void claim()}
              className={clsx(
                'h-10 w-[94px] !rounded-[10px] bg-black font-[Unbounded] text-[14px] font-medium text-white backdrop-blur-[25px]',
                !claimLoading && hasClaimable && 'hover:opacity-90'
              )}
              loading={claimLoading}
            >
              Claim
            </Button>
          </div>
        </div>

        <div className="my-3 h-px w-full bg-[#FFC42F]/20" />
        <div className="flex justify-between gap-2 px-4">
          <span className="font-[Unbounded] shrink-0 text-[12px] text-[#8A87AA]">
            Wallet Balance
          </span>
          <div className="flex justify-end flex-wrap gap-1">
            <div className="flex items-center gap-1">
              <img src={QUOTE_TOKEN.icon} alt="" className="h-4 w-4 rounded-full object-cover" />
              <span className="font-[Unbounded] text-[14px] text-black">
                {formatNumber(walletUsdt, 2, true)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <img src={BASE_TOKEN.icon} alt="" className="h-4 w-4 rounded-full object-cover" />
              <span className="font-[Unbounded] text-[14px] text-black">
                {formatNumber(walletBase, BASE_TOKEN.decimals > 6 ? 6 : 4, true)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
