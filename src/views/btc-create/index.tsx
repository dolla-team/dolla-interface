import clsx from 'clsx'
import { useMemo, useState } from 'react'
import PriceChart from './price-chart'
import { BASE_TOKEN } from '@/config/btc'
import { formatNumber } from '@/utils/format/number'
import useTokenPrice from '@/hooks/use-token-price'
import { motion } from 'framer-motion'
import Button from '@/components/button'
import DoughnutChart from './doughnut-chart'
import { useReferenceData } from './hooks/use-reference-data'
import Skeleton from '@/components/skeleton'
import Big from 'big.js'
import useIsMobile from '@/hooks/use-is-mobile'
import SuccessModal from './success-modal'
import { useAuth } from '@/contexts/wallet'
import { formatAddress } from '@/utils/format/address'
import Loading from '@/components/icons/loading'
import useQuote from './hooks/use-quote'
import useWalletStore from '@/stores/use-wallet'
import PageBack from '@/views/profile/components/page-back'
import { AMOUNT } from '@/config/btc'
import ConfirmModal from './confirm-modal'
import { useBtcCreateStore } from '@/stores/use-btc-create'
import { useNavigate } from '@/libs/router'
import { BTC_CREATE_FORM_URL } from '@/config'
import useLoginStore from '@/stores/use-login'
import useNearChainOnlyPrizeBalance from '@/hooks/near/use-only-prize-balance-near'

export default function BTCCreate() {
  const btcCreateStore = useBtcCreateStore()
  const [successResult, setSuccessResult] = useState<any>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const navigate = useNavigate()
  const {
    userInfo,
    isLoading,
    updateNearAccount,
    nearAccount,
    accountId,
    address,
    login,
    isCreatedWhitelist,
  } = useAuth() || {}
  const { wallet: loginWallet } = useLoginStore()

  const { token } = useQuote()
  const { onlyPrizeBalance } = useNearChainOnlyPrizeBalance(accountId)
  const tokenBalance = loginWallet === 'near' ? onlyPrizeBalance : nearAccount?.prizeBalance
  const {
    data: referenceData,
    loading: referenceDataLoading,
    bidsMarket,
  } = useReferenceData({ token: BASE_TOKEN, amount: btcCreateStore.amount })

  const isMobile = useIsMobile()

  const { prices } = useTokenPrice(BASE_TOKEN)

  const walletStore = useWalletStore()

  const pricePerBTC = useMemo(() => {
    if (BASE_TOKEN.address === 'usdt.tether-token.near') {
      return 1
    }
    if (!prices || prices?.length === 0) return 0
    const _p = prices[0].last_price
    return _p
  }, [prices])

  const errorTips = useMemo(() => {
    if (pricePerBTC === 0) {
      return 'Anchor price not found'
    }
    if (Big(btcCreateStore.amount).gt(Big(tokenBalance || 0))) {
      return `Insufficient ${BASE_TOKEN.symbol} Balance`
    }

    return ''
  }, [btcCreateStore.amount, pricePerBTC, tokenBalance])

  return (
    <div className="relative">
      <div className="w-full relative z-[2] text-[14px] font-[400] leading-[100%] pt-[30px] pb-[60px] max-md:pt-[80px]">
        <PageBack className="!border-[#555555] !bg-[#FFFFFF33] !text-[#fff] !top-[20px]" />
        <Title />
        <div className="w-[1200px] mx-auto gap-[15px] pt-[50px]">
          <div
            className="w-full h-[246px] p-[20px] rounded-[20px]"
            style={{
              background:
                'radial-gradient(30% 30% at 0% 0%, rgba(255, 196, 47, 0.30) 0%, rgba(255, 196, 47, 0.00) 100%), #000', // Adjusted to show gradient only in top-left corner
            }}
          >
            <div className="flex items-center">
              <div>
                <div className="text-white text-[14px] font-[500]">Create Market</div>
                <div className="text-white text-[12px] font-[400] flex items-center gap-[4px] mt-[10px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M6.99823 0.464844C3.37382 0.464844 0.43573 3.40293 0.43573 7.02734C0.43573 10.6518 3.37382 13.5898 6.99823 13.5898C10.6226 13.5898 13.5607 10.6518 13.5607 7.02734C13.5607 3.40293 10.6225 0.464844 6.99823 0.464844ZM6.99454 10.819C6.61706 10.819 6.31095 10.5129 6.31095 10.1354C6.31095 9.75789 6.61706 9.45178 6.99454 9.45178C7.37202 9.45178 7.67813 9.75789 7.67813 10.1354C7.67813 10.513 7.37202 10.819 6.99454 10.819ZM7.50956 8.365C7.50956 8.62723 7.28425 8.83982 7.00643 8.83982C6.72848 8.83982 6.50331 8.62723 6.50331 8.365C6.50331 8.365 6.1935 4.94895 6.19309 3.80611C6.19296 3.46801 6.55731 3.23559 7.00657 3.23559C7.42575 3.23559 7.8035 3.44777 7.8035 3.79627C7.80337 4.95742 7.50956 8.365 7.50956 8.365Z"
                      fill="#FFC42F"
                    />
                  </svg>
                  <span>
                    {' '}
                    <span className="font-[600] text-[#FFC42F]">Refund Conditions:</span> Markets
                    are locked for 72 hours after listing.
                  </span>
                </div>
                <div className="text-white text-[12px] font-[400]">
                  After that, if unsold, the seller may close it manually — this will trigger a 8%
                  penalty on total bids.
                </div>
                <div className="flex items-center">
                  <div className="mt-[6px] flex items-center gap-[10px] h-[140px]">
                    {AMOUNT.map((item, index) => {
                      const isActive = btcCreateStore.amount === item
                      return (
                        <motion.div
                          key={index}
                          className={clsx(
                            'button rounded-[12px] flex flex-col items-center justify-center gap-[9px] border w-[196px] h-[106px]',
                            !isActive ? 'backdrop-blur-[10px] text-white' : 'text-black'
                          )}
                          onClick={() => btcCreateStore.set({ amount: item })}
                          initial={{ height: 106 }}
                          animate={{
                            height: !isMobile ? (isActive ? 120 : 106) : 106,
                            borderColor: isActive ? '#E4E4E4' : '#A2A2A2',
                            backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                          }}
                          style={{
                            fontSize: isActive ? 20 : 16,
                          }}
                        >
                          <div className="text-[14px] font-[800]">
                            {item} {BASE_TOKEN.symbol}
                          </div>
                          <div className={clsx('text-[12px]')}>
                            ~${formatNumber(item * pricePerBTC, 0, true)}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="w-[1px] h-[200px] bg-[#424242] mx-[30px]" />
              <div className="relative flex-1">
                {!isCreatedWhitelist && (
                  <div className="absolute z-[2] top-[-40px] left-[-20px] w-[500px] h-[230px] flex flex-col items-center justify-center rounded-[20px] bg-[#00000099] backdrop-blur-[5px]">
                    <div className="text-white text-[18px] font-[300] text-center leading-[150%]">
                      You need to apply before using Create.
                    </div>
                    <Button
                      onClick={() => {
                        window.open(BTC_CREATE_FORM_URL, '_blank')
                      }}
                      className="w-[108px] h-[42px] !bg-[#FFC42F] !text-black !rounded-[10px] text-[16px] mt-[20px]"
                    >
                      Apply
                    </Button>
                  </div>
                )}
                <div className="text-center text-white text-[14px] font-[500] w-[200px] mx-auto truncate">
                  {userInfo?.name || formatAddress(userInfo?.user)}
                </div>
                <div className="mt-[40px] text-center text-[20px] font-[700] text-white">
                  {isLoading ? (
                    <Loading size={12} />
                  ) : (
                    `${formatNumber(tokenBalance, 6, true)} ${token.symbol}`
                  )}
                </div>
                {loginWallet !== 'near' && (
                  <button
                    onClick={(ev: any) => {
                      if (!isCreatedWhitelist) {
                        window.open(BTC_CREATE_FORM_URL, '_blank')
                        return
                      }
                      if (!address) {
                        login()
                        return
                      }
                      ev.stopPropagation()
                      walletStore.set({
                        showWallet: true,
                        panelType: 'deposit',
                        depositPanelType: 'input',
                        selectedToken: token,
                        defaultDepositAmount: btcCreateStore.amount,
                      })
                    }}
                    className="absolute top-[-10px] right-0 w-[86px] h-[30px] button rounded-[8px] border border-[#A2A2A2] bg-[#FFFFFF1A] text-white text-[12px] text-center"
                  >
                    Deposit
                  </button>
                )}
                <div className="text-center text-[14px] text-white mt-[10px]">Balance</div>
                <Button
                  disabled={!!errorTips}
                  className="mt-[20px] w-[466px] h-[50px] !bg-[#FFC42F]"
                  onClick={() => {
                    if (errorTips) return
                    setShowConfirmModal(true)
                  }}
                >
                  {errorTips || 'Create Market'}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-[29px] mt-[36px] rounded-[12px] bg-[#FFFFFF99] p-[24px] w-full max-md:mt-[40px] max-md:px-[12px]">
            <div className="w-1/2">
              <div className="text-[16px] text-black font-[500]">
                {btcCreateStore.amount} {BASE_TOKEN.symbol} Markets Reference Data
              </div>
              <div className="w-full grid grid-cols-3 gap-[10px] mt-[26px] max-md:mt-[15px] max-md:gap-[7px]">
                <div className="rounded-[12px] bg-[#EAEAEA] h-[93px] flex flex-col justify-center items-center gap-[10px]">
                  <div className="flex justify-center items-center gap-[7px]">
                    <div className="text-[12px]">Top Sale</div>
                    {Number(referenceData?.top_sale || 0) > 0 &&
                      !!referenceData?.top_sale_pool_id && (
                        <button
                          className="button"
                          onClick={() => {
                            navigate(`/btc/${referenceData?.top_sale_pool_id}`)
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path d="M1 9.5L9.5 1M9.5 1H1M9.5 1V9.5" stroke="black" />
                          </svg>
                        </button>
                      )}
                  </div>
                  <div className="font-[600] text-[16px]">
                    {referenceDataLoading ? (
                      <Skeleton className="w-[85px] h-[12px] rounded-full" />
                    ) : (
                      formatNumber(referenceData?.top_sale, 2, true, {
                        prefix: '$',
                      })
                    )}
                  </div>
                </div>
                <div className="rounded-[12px] bg-[#EAEAEA] h-[93px] flex flex-col justify-center items-center gap-[10px]">
                  <div className="flex justify-center items-center gap-[7px]">
                    <div className="text-[12px]">Avg. Profit</div>
                  </div>
                  <div className="font-[600] text-[16px]">
                    {referenceDataLoading ? (
                      <Skeleton className="w-[85px] h-[12px] rounded-full" />
                    ) : (
                      `${Big(referenceData?.avg_profit || 0).lt(0) ? '-' : ''} ${formatNumber(
                        Big(referenceData?.avg_profit || 0).abs(),
                        2,
                        true,
                        {
                          prefix: '$',
                        }
                      )}`
                    )}
                  </div>
                </div>
                <div className="rounded-[12px] bg-[#EAEAEA] h-[93px] flex flex-col justify-center items-center gap-[10px]">
                  <div className="flex justify-center items-center gap-[7px]">
                    <div className="text-[12px]">Live</div>
                  </div>
                  <div className="font-[600] text-[16px]">
                    {referenceDataLoading ? (
                      <Skeleton className="w-[85px] h-[12px] rounded-full" />
                    ) : (
                      formatNumber(referenceData?.live, 0, true)
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full mt-[30px] grid grid-cols-2 h-[210px] place-items-center max-md:grid-cols-1 max-md:mt-[28px] max-md:h-[unset]">
                {isMobile && (
                  <div className="text-[#FFE9B2] text-[16px] text-left w-full">Cash out timing</div>
                )}
                <DoughnutChart
                  className="!w-[210px] !h-[210px] max-md:mt-[12px]"
                  data={referenceData?.timing || []}
                  formatLabel={(record: any) => {
                    return (
                      <div className="flex flex-col items-center justify-center gap-[5px]">
                        <div className="text-[12px] text-[#8A87AA] rounded-[12px] border border-[#E4E4E4] bg-white px-[12px] py-[4px]">
                          {btcCreateStore.amount} {BASE_TOKEN.symbol}
                        </div>
                        {!isMobile && (
                          <div className="text-[#8A87AA] text-[12px]">
                            Cash out timing {record.timing_empty}
                          </div>
                        )}
                        <div className="text-[16px] font-[800]">
                          {record?.value === 0 ? 'in - days' : record.label}
                        </div>
                        <div className="text-[12px] mt-[10px] text-[#8A87AA]">
                          {record?.value === 0 ? '-' : record.percentage}%
                        </div>
                      </div>
                    )
                  }}
                />
                {isMobile && (
                  <div className="text-[#FFE9B2] text-[16px] text-left w-full mt-[30px]">
                    Bids overmarket
                  </div>
                )}
                <DoughnutChart
                  className="!w-[210px] !h-[210px] max-md:mt-[12px]"
                  data={bidsMarket}
                  volume={btcCreateStore.amount.toString()}
                  formatLabel={(record: any) => {
                    return (
                      <div className="flex flex-col items-center justify-center gap-[5px]">
                        <div className="text-[12px] text-[#8A87AA] rounded-[12px] border border-[#E4E4E4] bg-white px-[12px] py-[4px]">
                          {record.label} {BASE_TOKEN.symbol}
                        </div>
                        {!isMobile && (
                          <div className="text-[#8A87AA] mt-[4px]">Bids overmarket</div>
                        )}
                        <div className="font-[800] text-[16px] mt-[1px]">
                          $
                          {record.times
                            ? formatNumber(record.times, 2, true, {
                                isShort: true,
                              })
                            : '-'}{' '}
                          Bids
                        </div>
                        <div className="text-[12px] mt-[10px] text-[#8A87AA]">
                          {record.value ? record.percentage : '-'}%
                        </div>
                      </div>
                    )
                  }}
                />
              </div>
            </div>
            <PriceChart
              anchorPrice={btcCreateStore.amount * pricePerBTC}
              className="mt-[40px] rounded-[12px] bg-[#EAEAEA] h-[379px] !w-1/2"
            />
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 w-full h-[285px] bg-[url('/btc/btc-create-bg.jpg')] bg-cover bg-top bg-no-repeat z-0 pointer-events-none" />
      <SuccessModal
        open={!!successResult}
        data={successResult}
        price={pricePerBTC}
        onClose={() => setSuccessResult(null)}
      />
      <ConfirmModal
        open={showConfirmModal}
        amount={btcCreateStore.amount}
        pricePerBTC={pricePerBTC}
        onSuccess={(id: string) => {
          updateNearAccount?.()
          setShowConfirmModal(false)

          // navigate("/portfolio/seller");
          setSuccessResult({
            pool_id: id,
            amount: btcCreateStore.amount,
          })
        }}
        onClose={() => {
          setShowConfirmModal(false)
        }}
      />
    </div>
  )
}

const Title = () => {
  return (
    <div className="flex items-center justify-center gap-[10px] text-white">
      <span className="text-[20px] font-[500]">Create a {BASE_TOKEN.symbol} Market</span>
    </div>
  )
}
