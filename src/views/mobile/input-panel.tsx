import DollaEye from '@/components/dolla-eye'
import clsx from 'clsx'
import { RandomText } from '@/views/verify-email/analyze-input-panel'
import { motion } from 'framer-motion'
import { LineIcon } from '@/views/verify-email/icons'
import AnalyzeLoadingPanel from '@/views/verify-email/analyze-loading-panel'
import { useGlobalStore } from '@/stores/use-global'
import SocialLinks from '@/views/verify-email/social-links'
import { BackButton } from '@/views/verify-email/analyze-result-panel'


export default function InputPanel({
  xProfileUrl,
  setXProfileUrl,
  isValid,
  handle,
  data,
  onAnalyze,
}: any) {
  const globalStore = useGlobalStore()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Prevent input if it contains spaces
    if (value.includes(' ')) {
      return
    }
    setXProfileUrl(value)
  }

  return (
    <div className="pt-[50px] h-screen">
      {globalStore.isInWhitelist && (
        <BackButton
          onClick={() => {
            globalStore.set({
              isInWhitelist: false,
            })
          }}
          className="fixed z-[5] top-[20px] left-[10px]"
        />
      )}
      <div className="relative z-[2]">
        <div className="text-white text-center text-lg font-semibold leading-[130%] uppercase">
          {data?.status === 'input' && !globalStore.isInWhitelist ? 'attemp to get access to' : ''}
        </div>
        <div className="flex justify-center mt-[10px] relative">
          <DollaEye height={60} />
          {data?.status === 'input' && !globalStore.isInWhitelist && (
            <img
              src="/verify/verify-labels.png"
              className="absolute w-[26vw] object-cover top-[-10px] right-[calc(50%-180px)]"
            />
          )}
        </div>
        <div className="w-[calc(100%-40px)] mx-auto mt-[14px] text-[#D9D9D9] text-center font-[Courier] text-base leading-[120%] tracking-[-0.96px]">
          {data?.status === 'input' && !globalStore.isInWhitelist
            ? "and get personalized probabilistic facts that you don't even know about yourself"
            : ''}
        </div>
      </div>
      <div className="absolute bottom-[60vw] w-full z-[1]">
        <div className="absolute bottom-[0px] left-0 right-0 w-full h-[76px] bg-linear-to-t from-[#000] to-transparent"></div>
        <img src="/verify/verify-woman.png" className="mx-auto w-[90vw] object-cover" />
        <motion.img
          src="/verify/verify-usdt.png"
          className="absolute top-[18vw] left-[2vw] w-[13vw] object-cover"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.img
          src="/verify/verify-btc.png"
          className="absolute top-[-38vw] right-[-14vw] w-[40vw] object-cover"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <LineIcon className="absolute left-[80px] top-[-36vw] w-[44vw]" />
      </div>

      {globalStore.isInWhitelist ? (
        <div
          className="absolute z-[2] flex flex-col items-center justify-center rounded-[12px] mx-auto bottom-[40vw] py-[3vw] left-0 right-0 w-[calc(100%-40px)] border border-[#FFE1AA]"
          style={{
            background: 'linear-gradient(90deg, #FFCE52 0%, #FFE9B2 100%)',
          }}
        >
          <div className="text-[16px] text-black font-[600]">You’re whitelisted!</div>
          <div className="text-[14px] text-black font-[400] w-[306px] text-center mt-[20px]">
            Please move to laptop for a better experience
          </div>
        </div>
      ) : (
        <>
          {data?.status === 'input' && (
            <div className="absolute z-[2] bottom-[60px] left-0 right-0 w-[calc(100%-40px)] mx-auto h-[210px]">
              <div className="h-[50px] rounded-[8px] bg-white backdrop-blur-[10px] p-[1px] border border-[#8A87AA4D]">
                <input
                  value={xProfileUrl}
                  onChange={handleInputChange}
                  placeholder="Enter your X profile URL"
                  className={clsx(
                    'bg-transparent rounded-[8px] w-full h-full pl-[16px] text-[16px] text-[#000] border border-transparent',
                    !isValid && '!border-[#F87168]'
                  )}
                  autoFocus={true}
                />
              </div>
              <button
                onClick={() => {
                  if (!isValid || xProfileUrl === '') {
                    return
                  }
                  onAnalyze()
                }}
                className={clsx(
                  'button mt-[20px] mb-[10px] w-full h-[50px] text-[16px] text-[#000] rounded-[8px] bg-gradient-to-r from-[#FFCE52] to-[#FFE9B2] shadow-[3px_3px_0_0_#AB6F00]'
                )}
              >
                Go
              </button>
              <RandomText />
              <div className="w-[254px] mx-auto text-[#979797] text-center text-[12px] mt-[20px] leading-[130%]">
                Please head to website on PC if you already have an account
              </div>
            </div>
          )}
          {data?.status === 'loading' && (
            <div className="absolute z-[2] bottom-[60px] left-0 right-0 w-full h-[210px] overflow-hidden flex flex-col items-center">
              <AnalyzeLoadingPanel handle={handle} onAnalyze={onAnalyze} />
            </div>
          )}
        </>
      )}
      <SocialLinks className="absolute bottom-[20px] w-full flex items-center justify-center gap-[50px]" />
    </div>
  )
}
