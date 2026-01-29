import { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import useLoginStore from '@/stores/use-login'

const Texts = [
  '69% to be investigated by @ZachXBT next',
  '47% says "zoom out" while being down 63%',
  '99% retarded',
  '81% says "this is my last trade" at least once a week',
  '58% watched a candle instead of sleeping and still lost money',
  '66% bought because of a tweet',
  '42% still waiting for a retest that never comes',
  '76% round-tripped a winner because "it felt early"',
]

export default function AnalyzeInputPanel({
  xProfileUrl,
  setXProfileUrl,
  isValid,
  onAnalyze,
  setIsBgSpread,
  onChangeHasAccount,
}: any) {
  const loginStore = useLoginStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Prevent input if it contains spaces
    if (value.includes(' ')) {
      return
    }
    setXProfileUrl(value)
  }
  return (
    <>
      <img
        src="/verify/verify-labels.png"
        className="absolute w-[154px] h-[122px] object-cover top-[60px] right-[20px]"
      />
      <div className="mt-[60px] text-white text-center text-[20px] font-semibold leading-[130%] uppercase">
        attempt to get access to dolla
      </div>
      <div className="text-center text-[16px] mt-[8px] font-[Courier] leading-[120%] tracking-[-1.08px] text-[#D9D9D9]">
        and get personalized probabilistic facts that you don't even know about yourself
      </div>
      <div className="flex justify-center gap-[25px] mt-[50px]">
        <div className="w-[400px]">
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
        </div>
        <button
          onMouseEnter={() => setIsBgSpread(true)}
          onMouseLeave={() => setIsBgSpread(false)}
          onClick={() => {
            if (!isValid || xProfileUrl === '') {
              return
            }
            onAnalyze()
            loginStore.set({ isX: true })
          }}
          className={clsx(
            'button w-[126px] h-[50px] text-[16px] text-[#000] rounded-[8px] bg-gradient-to-r from-[#FFCE52] to-[#FFE9B2] shadow-[3px_3px_0_0_#AB6F00]'
          )}
        >
          Go
        </button>
      </div>
      <RandomText />
      <div
        onClick={() => {
          onChangeHasAccount(true)
          loginStore.set({ isX: false })
        }}
        className="mt-[180px] text-center text-white text-[14px] leading-[130%] underline cursor-pointer"
      >
        I already have an account
      </div>
    </>
  )
}

export const RandomText = () => {
  const [currentText, setCurrentText] = useState(Texts[0])
  const [nextText, setNextText] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const lastIndexRef = useRef(0)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        let randomIndex = Math.floor(Math.random() * Texts.length)
        while (randomIndex === lastIndexRef.current) {
          randomIndex = Math.floor(Math.random() * Texts.length)
        }
        lastIndexRef.current = randomIndex
        const newText = Texts[randomIndex]

        if (newText !== currentText) {
          setNextText(newText)
          setIsAnimating(false)

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setIsAnimating(true)

              setTimeout(() => {
                setCurrentText(newText)
                setIsAnimating(false)
                setNextText('')
              }, 300)
            })
          })
        }

        scheduleNext()
      }, 2000)
    }

    scheduleNext()

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])
  return (
    <div
      className="mt-[4px] text-center font-[Courier] text-[18px] font-normal leading-[120%] tracking-[-1.08px] mt-[10px] text-[#8FFFC9] overflow-hidden relative"
      style={{ minHeight: '22px' }}
    >
      <div className="opacity-0 pointer-events-none h-[22px] truncate">{currentText}</div>
      <div
        className={clsx(
          'transition-all duration-300 ease-in-out absolute top-0 left-0 right-0 truncate',
          isAnimating ? 'translate-y-[-150%] opacity-0' : 'translate-y-0 opacity-100'
        )}
        style={{ height: '22px' }}
      >
        {currentText}
      </div>
      {nextText && (
        <div
          className={clsx(
            'transition-all duration-300 ease-in-out absolute top-0 left-0 right-0 truncate',
            isAnimating ? 'translate-y-[150%] opacity-100' : 'translate-y-0 opacity-0'
          )}
          style={{ height: '22px' }}
        >
          {nextText}
        </div>
      )}
    </div>
  )
}