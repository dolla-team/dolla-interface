import AnimatedCounter from '@/components/animated-counter'
import clsx from 'clsx'
import SavedImage from './analyze-saved-image'
import { motion } from 'framer-motion'
import { useShare } from '@/sections/share/use-share'
import { useEffect, useRef, useState } from 'react'
import Refresh from '@/components/icons/refresh'
import Button from '@/components/button'
import { useVerifyStore } from '@/stores/use-verify'
import { useAuth } from '@/contexts/auth'
import { useAnalysisDataStore } from '@/stores/use-analysis-data'
import { useGlobalStore } from '@/stores/use-global'
import { EmptyIcon } from './icons'

export default function ResultPanel({ result, reward, onBackToAnalyze }: any) {
  const savedImageRef = useRef<HTMLDivElement>(null)
  const { generateAndDownload } = useShare()
  const { login, logout, user } = useAuth()
  const analysisData = useAnalysisDataStore()
  const globalStore = useGlobalStore()

  const handleShareToTwitter = () => {
    const currentUrl = window.location.href
    const text = `turns out my life has a probability curve.%0A%0Amath is kinda exposing me rn.%0A%0Aget your own probabilistic facts card at: dolla.market`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
  }

  const predictions =
    result.aiPredictions?.sort((a: any, b: any) => a.probability - b.probability) || []

  const isSameUser = user ? user?.twitter?.username === analysisData?.handle : true

  useEffect(() => {
    if (user?.twitter?.username === analysisData?.handle) {
      globalStore.set({
        isInWhitelist: true,
      })
    }
  }, [user])

  const handleLogin = () => {
    if (!user || user?.twitter?.username === analysisData?.handle) {
      login()
    }
  }
  const handleLogout = () => {
    if (user) {
      logout()
    } else {
      analysisData.init()
    }
    onBackToAnalyze()
  }

  return (
    <>
      <div className="w-[542px] p-[24px] font-[Courier] mt-[20px] rounded-[20px] border-[#3E300E] bg-[#3F3F3F99] shadow-[0_2px_6px_0_rgba(0,0,0,0.25)_inset] backdrop-blur-[10px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[15px]">
            {result?.profile?.user?.profileImageUrl && (
              <img
                src={result.profile.user.profileImageUrl}
                alt={result.profile.user.userName}
                className="w-[62px] h-[62px] rounded-full object-cover"
              />
            )}
            <div className="text-white">
              <div className="text-[26px] truncate max-w-[300px] leading-[130%]">
                {result?.profile?.user?.displayName}
              </div>
              <div className="text-[18px] mt-[2px]">@{analysisData?.handle}</div>
            </div>
          </div>
          <div className="text-right leading-[120%]">
            <div className="text-[18px] text-white">DEI Score</div>
            <div className="text-[46px] text-[#00FF84] mt-[18px]">
              {isNaN(result.finalScore) ? (
                result.finalScore
              ) : (
                <AnimatedCounter value={result.finalScore || 0} />
              )}
            </div>
          </div>
        </div>
        <div className="mt-[28px] flex flex-col gap-[8px]">
          {predictions?.length > 0 ? (
            predictions.map((prediction: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.5,
                  ease: 'easeOut',
                }}
                className="w-[494px] h-[68px] gap-[10px] rounded-[12px] bg-[#00000026] flex items-center pl-[18px]"
              >
                <div
                  className={clsx(
                    'w-[80px] text-[30px] shrink-0',
                    index === 0 && 'text-[#5C69FF]',
                    index === 1 && 'text-[#FFCE52]',
                    index === 2 && 'text-[#00FF84]'
                  )}
                >
                  {prediction.probability}%
                </div>
                <div className="text-[14px] leading-[125%] text-white shrink-1 line-clamp-3">
                  {prediction.prediction}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-[100px]">
              <EmptyIcon />
              <div className="text-[#8C8C8C] text-[16px] mt-[8px]">
                No valid information was detected
              </div>
            </div>
          )}
        </div>
      </div>
      {predictions?.length > 0 && (
        <div className="flex items-center justify-end gap-[14px] mt-[10px] w-full font-[Courier]">
          <button
            onClick={async () => {
              if (!savedImageRef.current) {
                console.error('Image ref is not available')
                return
              }
              try {
                await generateAndDownload(savedImageRef.current, 'dolla-voucher', {
                  format: 'png',
                  width: 1332,
                  height: 750,
                  backgroundColor: '#000',
                  pixelRatio: 2,
                })
              } catch (error) {
                console.error('Failed to generate and download image:', error)
              }
            }}
            className="button flex items-center justify-center gap-[4px] w-[113px] h-[26px] rounded-[6px] bg-[#00000026] text-[14px] text-[#D9D9D9]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="12"
              viewBox="0 0 14 12"
              fill="none"
              className="mt-[-3px]"
            >
              <path
                d="M12.8359 8.17285C12.9797 8.17629 13.117 8.23426 13.2188 8.33594C13.3204 8.43762 13.3784 8.57499 13.3818 8.71875C13.3818 10.5409 12.0685 12 10.4648 12H2.91699C1.31351 11.9998 0 10.5408 0 8.71875C0.00346378 8.57499 0.0623736 8.43763 0.164062 8.33594C0.265777 8.2344 0.403183 8.17625 0.546875 8.17285C0.690381 8.17636 0.827106 8.23454 0.928711 8.33594C1.0304 8.43762 1.08931 8.57499 1.09277 8.71875C1.09277 9.92078 1.89564 10.8981 2.91699 10.9072H10.4648C11.4864 10.9072 12.2891 9.92091 12.2891 8.71875C12.2925 8.57499 12.3514 8.43763 12.4531 8.33594C12.5549 8.23432 12.6922 8.17625 12.8359 8.17285ZM6.74609 0C6.88539 0.000105024 7.01949 0.0531348 7.12109 0.148438C7.22279 0.243848 7.28407 0.37451 7.29297 0.513672V6.71387L8.42383 5.58301C8.5272 5.49167 8.66193 5.44301 8.7998 5.44727C8.93764 5.45156 9.0685 5.50893 9.16602 5.60645C9.26351 5.70397 9.31995 5.83482 9.32422 5.97266C9.32847 6.11054 9.28079 6.24526 9.18945 6.34863L7.11035 8.42676C6.99752 8.52031 6.85555 8.57224 6.70898 8.57227C6.56238 8.57227 6.42047 8.52033 6.30762 8.42676L4.30273 6.34863C4.21138 6.24525 4.16274 6.11055 4.16699 5.97266C4.17126 5.83485 4.22774 5.70397 4.3252 5.60645C4.42267 5.50897 4.55363 5.4516 4.69141 5.44727C4.82925 5.44301 4.96402 5.49172 5.06738 5.58301L6.19824 6.71387V0.513672C6.20714 0.374524 6.26844 0.243847 6.37012 0.148438C6.47183 0.0530161 6.60663 0 6.74609 0Z"
                fill="#D9D9D9"
              />
            </svg>
            <span>save image</span>
          </button>
          <button
            onClick={handleShareToTwitter}
            className="button flex items-center justify-center gap-[6px] w-[75px] h-[26px] rounded-[6px] bg-[#00000026] text-[14px] text-[#D9D9D9]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="mt-[-3px]"
            >
              <path
                d="M11.0517 6.31581C11.0517 6.19018 11.1016 6.0697 11.1904 5.98086C11.2793 5.89203 11.3997 5.84212 11.5254 5.84212C11.651 5.84212 11.7715 5.89203 11.8603 5.98086C11.9491 6.0697 11.999 6.19018 11.999 6.31581V10.2632C11.999 11.2224 11.2214 12 10.2623 12H1.7367C0.777567 12 0 11.2224 0 10.2632V2.21056C0 1.25135 0.777567 0.473719 1.7367 0.473719H5.84162C5.96724 0.473719 6.08772 0.523625 6.17654 0.612457C6.26537 0.70129 6.31527 0.821773 6.31527 0.947402C6.31527 1.07303 6.26537 1.19351 6.17654 1.28235C6.08772 1.37118 5.96724 1.42108 5.84162 1.42108H1.7367C1.52733 1.42108 1.32655 1.50426 1.1785 1.65232C1.03046 1.80037 0.94729 2.00118 0.94729 2.21056V10.2632C0.94729 10.4725 1.03046 10.6733 1.1785 10.8214C1.32655 10.9695 1.52733 11.0526 1.7367 11.0526H10.2623C10.4717 11.0526 10.6725 10.9695 10.8205 10.8214C10.9685 10.6733 11.0517 10.4725 11.0517 10.2632V6.31581ZM10.4292 2.21056L9.10014 0.79835C9.01405 0.70685 8.96783 0.584896 8.97165 0.459316C8.97547 0.333737 9.02902 0.214817 9.12051 0.12872C9.212 0.0426226 9.33395 -0.00360056 9.45952 0.000219245C9.58509 0.00403905 9.704 0.0575889 9.79009 0.149088L11.8703 2.35961C12.1548 2.66182 11.9404 3.15792 11.5254 3.15792H9.14782C7.93892 3.15792 6.94679 4.21202 6.94679 5.52634V8.36843C6.94679 8.49406 6.89689 8.61454 6.80807 8.70338C6.71924 8.79221 6.59877 8.84212 6.47315 8.84212C6.34753 8.84212 6.22706 8.79221 6.13823 8.70338C6.04941 8.61454 5.9995 8.49406 5.9995 8.36843V5.52634C5.9995 3.70124 7.40244 2.21056 9.14782 2.21056H10.4292Z"
                fill="#D9D9D9"
              />
            </svg>
            <span>share</span>
          </button>
        </div>
      )}
      {reward > 0 ? (
        <VoucherPanel
          dei={result.finalScore}
          rankInfo={result.rankInfo}
          login={handleLogin}
          logout={handleLogout}
          reward={reward}
          isSameUser={isSameUser}
        />
      ) : (
        <NoVoucherPanel login={handleLogin} />
      )}
      <button
        onClick={() => handleLogout()}
        className="fixed top-[20px] left-[20px] button w-[88px] h-[34px] rounded-[20px] border border-[#373737] bg-[#00000080] backdrop-blur-[15px] flex items-center justify-center gap-[10px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="12"
          viewBox="0 0 8 12"
          fill="none"
        >
          <path
            d="M6.41406 1L1.41406 6L6.41406 11"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-white text-[12px]">Back</span>
      </button>
      {predictions?.length > 0 && (
        <SavedImage
          imageRef={savedImageRef}
          result={result}
          handle={analysisData?.handle}
          predictions={predictions}
        />
      )}
    </>
  )
}

export const NoVoucherPanel = ({ login }: any) => {
  const [refreshingFollow, setRefreshingFollow] = useState(false)
  const [refreshingRetweet, setRefreshingRetweet] = useState(false)
  const { followed, retweeted, followClicked, retweetClicked, set } = useVerifyStore()

  const handleGetStart = () => {
    login()
  }

  return (
    <>
      <div className="w-[542px] mt-[20px] text-center font-mono text-[16px] font-normal leading-[120%] tracking-[-1.08px] text-white">
        <div>Your Dolla Eligibility Index (DEI) is too low.</div>
        <div className="mt-[4px] leading-[150%]">
          Get access via another user's referral link or complete the following tasks:
        </div>
      </div>
      <div className="w-[542px] px-[24px] py-[16px] mt-[20px] font-[Courier] rounded-[20px] border border-[#3E300E] bg-[#3F3F3F99] shadow-[0_2px_6px_0_rgba(0,0,0,0.25)_inset] backdrop-blur-[10px]">
        <div className="flex flex-col gap-[10px]">
          {/* Follow button */}
          <button
            onClick={() => {
              set({
                followClicked: true,
              })
              const path = `https://x.com/intent/follow?screen_name=Dollamarket`
              window.open(path, '_blank')
            }}
            className="w-full h-[42px] cursor-pointer rounded-[12px] bg-[#00000026] flex items-center justify-between px-[16px] hover:bg-[#333333] transition-colors"
          >
            <span className="text-white text-[14px]">Follow @Dollamarket on X</span>
            <div className="flex items-center gap-[8px]">
              {!followed ? (
                <div
                  className="text-white cursor-pointer"
                  onClick={ev => {
                    ev.stopPropagation()
                    setRefreshingFollow(true)
                    setTimeout(() => {
                      if (followClicked) set({ followed: true })
                      setRefreshingFollow(false)
                    }, 5000)
                  }}
                >
                  <Refresh refreshing={refreshingFollow} size={16} />
                </div>
              ) : (
                <Completed />
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-white"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          {/* Retweet button */}
          <button
            onClick={() => {
              set({
                retweetClicked: true,
              })
              const path = `https://x.com/Dollamarket`
              window.open(path, '_blank')
            }}
            className="w-full h-[42px] cursor-pointer rounded-[12px] bg-[#00000026] flex items-center justify-between px-[16px] hover:bg-[#333333] transition-colors"
          >
            <span className="text-white text-[14px]">Retweet on X</span>
            <div className="flex items-center gap-[8px]">
              {!retweeted ? (
                <div
                  className="text-white cursor-pointer"
                  onClick={ev => {
                    ev.stopPropagation()
                    setRefreshingRetweet(true)
                    setTimeout(() => {
                      if (retweetClicked) set({ retweeted: true })
                      setRefreshingRetweet(false)
                    }, 5000)
                  }}
                >
                  <Refresh refreshing={refreshingRetweet} size={16} />
                </div>
              ) : (
                <Completed />
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="text-white"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>

          {/* Get Start button */}
          <Button
            onClick={handleGetStart}
            disabled={!followed || !retweeted}
            className="mx-auto w-[208px] h-[50px] rounded-[12px] !bg-[#FFC42F] !text-[#000] mt-[8px] text-[14px] font-[Unbounded]"
          >
            Sign In
          </Button>
        </div>
      </div>
    </>
  )
}

const VoucherPanel = ({ dei, reward, rankInfo, login, logout, isSameUser }: any) => {
  const goToApp = async () => {
    login()
  }
  const percentage =
    !rankInfo?.rank || !rankInfo?.total ? 0 : (rankInfo.rank / rankInfo?.total) * 100

  return (
    <div
      className="w-[542px] rounded-[20px] border border-[#FFE1AA] mt-[20px] px-[24px] py-[18px] font-[Courier]"
      style={{
        background: 'linear-gradient(90deg, #FFCE52 0%, #FFE9B2 100%)',
      }}
    >
      <div className="text-[16px] leading-[120%] text-black w-[444px] text-center mx-auto">
        Your dolla eligibility index (DEI) is {dei}, in top {percentage.toFixed(0)}% Congrats!
        You’ve got voucher
      </div>
      <div className="flex items-center gap-[15px] text-[18px] text-black italic font-[700] mt-[12px]">
        <div className="w-[216px] h-[60px] rounded-[12px] bg-[#0000001A] flex items-center justify-center gap-[4px] ">
          <span>·</span>
          <img src="/tokens/usdt.png" alt="usdt" className="w-[24px] h-[24px]" />
          <span>{reward} USDT Voucher</span>
        </div>
        <div className="w-[262px] h-[60px] rounded-[12px] bg-[#0000001A] flex items-center justify-center gap-[4px] ">
          <span>·</span>
          <span>Dollar Priority Access</span>
        </div>
      </div>
      <Button
        onClick={goToApp}
        disabled={!isSameUser}
        className="w-full h-[50px] gap-[10px] rounded-[12px] !bg-[#000] !text-[#fff] mt-[20px] text-[14px] font-[Unbounded] font-[400]"
      >
        {isSameUser ? (
          <>
            <span>Verify X to claim</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="11"
              viewBox="0 0 15 11"
              fill="none"
            >
              <path
                d="M1 5.5H13.5M13.5 5.5L9 1M13.5 5.5L9 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        ) : (
          'Verify failed'
        )}
      </Button>
      {!isSameUser && (
        <div className="text-[12px] text-[#FF2F2F] mt-[10px] text-center font-[Unbounded]">
          The X account is inconsistent, please{' '}
          <span
            className="underline cursor-pointer"
            onClick={() => {
              logout()
            }}
          >
            redo analysis
          </span>
        </div>
      )}
    </div>
  )
}

const Completed = () => (
  <div className="flex items-center gap-[4px]">
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="13" viewBox="0 0 17 13" fill="none">
      <path
        d="M0.712891 5.46356L5.86914 10.7017L15.7129 0.70166"
        stroke="#54FF59"
        stroke-width="2"
      />
    </svg>
    <span className="text-[#54FF59] text-[14px]">Complete</span>
  </div>
)
