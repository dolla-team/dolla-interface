import { useAuth } from '@/contexts/wallet'
import { formatNumber } from '@/utils/format/number'
import Big from 'big.js'
import { BASE_TOKEN, QUOTE_TOKEN } from '@/config/btc'
import useTokenPrice from '@/hooks/use-token-price'
import { useMemo } from 'react'
import clsx from 'clsx'

export default function Tokens({ onClick }: { onClick?: (token: any) => void }) {
  const { nearAccount } = useAuth() || {}

  const tokenIds = useMemo(() => {
    return [
      {
        chain: 'near',
        address: QUOTE_TOKEN?.address,
      },
      {
        chain: 'near',
        address: BASE_TOKEN?.address,
      },
    ]
  }, [QUOTE_TOKEN, BASE_TOKEN])

  const { prices } = useTokenPrice(tokenIds)

  return (
    <div>
      <Item
        balance={nearAccount?.balance}
        price={prices[0]?.last_price || 1}
        token={QUOTE_TOKEN}
        onClick={onClick}
      />
      <Item
        balance={nearAccount?.prizeBalance}
        price={prices[1]?.last_price || 1}
        token={BASE_TOKEN}
        onClick={onClick}
      />
    </div>
  )
}

const Item = ({
  balance,
  price,
  token,
  onClick,
}: {
  balance: string
  price: number
  token: any
  onClick?: (token: any) => void
}) => {
  return (
    <div className={clsx('relative group', token.isBaseToken ? 'pt-[80px]' : 'pt-[60px]')}>
      <div className="absolute left-[10px] top-0">
        <img
          src={token.isBaseToken ? '/tokens/base-token.png' : '/tokens/bid-token.png'}
          className={clsx(
            'object-cover group-hover:scale-[1.1] duration-300 grayscale group-hover:grayscale-0',
            token.isBaseToken ? 'w-[77px] h-[80px] mt-[10px]' : 'w-[98px] h-[68px] mt-[0px]'
          )}
        />
      </div>
      <div
        className={clsx(
          'absolute origin-bottom right-0 text-black text-right font-[Bungee] text-[24px] tracking-[-1.2px] transform rotate-[0.083deg] group-hover:text-[30px] group-hover:leading-none group-hover:tracking-[-3px] group-hover:[-webkit-text-stroke-width:2px] group-hover:[-webkit-text-stroke-color:#FFC42F] transition-all duration-200',
          token.isBaseToken ? 'top-[54px]' : 'top-[34px]'
        )}
      >
        {token.isBaseToken ? 'Seller' : 'Bidder'}
      </div>
      <div
        className={clsx(
          'rounded-[10px] w-[300px] h-[88px] bg-black border border-[#ECECEC] hover:border-[#FFC42F] p-[4px] relative z-[5]',
          onClick && 'cursor-pointer'
        )}
        onClick={() => {
          onClick?.(token)
        }}
      >
        <div className="flex items-center justify-between px-[10px] py-[4px]">
          <span className="text-[12px] text-white">
            {token.isBaseToken ? 'Market Creation Assets' : 'Dolla Bid Assets'}
          </span>
          {!token.isBaseToken && <span className="text-[12px] text-[#8A87AA]">1Bid = 1 USDT</span>}
        </div>
        <div className="h-[52px] bg-white rounded-[10px] flex items-center justify-between px-[10px]">
          <div className="flex items-center gap-[8px]">
            <div className="w-[32px] h-[32px] rounded-full relative">
              <img src={token.icon} className="w-full h-full object-cover" />
            </div>
            <div>
              <div>
                <span className="text-[14px] text-black">{token.symbol} </span>
              </div>
              <div className="text-[12px] text-[#8A87AA]">${formatNumber(price, 2, true)}</div>
            </div>
          </div>
          <div>
            <div className="text-[14px] text-black text-right">
              {formatNumber(balance || 0, token.decimals > 6 ? 6 : 2, true)}
            </div>
            <div className="text-[12px] text-[#8A87AA] text-right">
              $
              {formatNumber(
                Big(balance || 0)
                  .mul(price)
                  .toNumber(),
                2,
                true
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
