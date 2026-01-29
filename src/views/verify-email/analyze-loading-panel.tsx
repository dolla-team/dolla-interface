import { motion } from "framer-motion";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import Typewriter from "./typewriter";
import useIsMobile from '@/hooks/use-is-mobile'

export const Texts = [
  'Scanning Meme Signals…',
  'Detecting Degen Frequency…',
  'Generating personalized predictions…',
  'Syncing with Dolla Random Engine…',
]

export default function LoadingPanel({ handle, onRetry }: any) {
  const [showBusyMessage, setShowBusyMessage] = useState(false);
  const [showRetryButton, setShowRetryButton] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const isMobile = useIsMobile()

  useEffect(() => {
    startTimeRef.current = Date.now();
    setShowBusyMessage(false);
    setShowRetryButton(false);

    // Show busy message after 15 seconds
    const busyTimer = setTimeout(() => {
      setShowBusyMessage(true);
    }, 15000);

    // Show retry button after 60 seconds
    const retryTimer = setTimeout(() => {
      setShowRetryButton(true);
    }, 60000);

    return () => {
      clearTimeout(busyTimer);
      clearTimeout(retryTimer);
    };
  }, [handle, retryKey]);

  const handleRetry = () => {
    if (onRetry) {
      setShowBusyMessage(false);
      setShowRetryButton(false);
      startTimeRef.current = Date.now();
      setRetryKey((prev) => prev + 1);
      onRetry();
    }
  };

  return (
    <>
      {!isMobile && (
        <div className="text-[26px] text-[#FFC42F] mt-[100px] mb-[40px]">
          Looking into <span className="text-[#37C2FF]">@{handle}</span>'s inner soul...
        </div>
      )}
      {showBusyMessage ? (
        <div className="text-[16px] text-[#FFC42F] mt-[8px] animate-pulse text-center">
          {showRetryButton ? (
            'This request timed out. Please tap Retry to try again.'
          ) : (
            <>
              <div>Too much attention at once.</div>
              <div>Dolla social checks are running hot. Your score’s in line — give us a sec.</div>
            </>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="rounded-[6px] relative z-[2] bg-gradient-to-r from-[#FFCC49] to-[#564210] shadow-[0_0_10px_0_rgba(255,206,82,0.5)] p-[1px]">
            <div
              className={clsx(
                'text-[#FFDB7E] relative overflow-hidden mx-auto text-center rounded-[7px] bg-gradient-to-r from-[#4B433A] to-[#423424]',
                isMobile
                  ? 'w-[348px] h-[50px] text-[14px] leading-[50px]'
                  : 'w-[460px] h-[58px] text-[20px] leading-[58px]'
              )}
            >
              <Typewriter texts={Texts} />
              <motion.div
                className="absolute top-0 w-[30%] h-full blur-[10px]"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(27, 27, 27, 0.00) 0%, rgba(255, 206, 82, 0.30) 50.96%, rgba(27, 27, 27, 0.00) 100%)',
                }}
                animate={{
                  x: ['-100%', '300%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>
          </div>
          <motion.div
            className="absolute top-[1px] left-[50%] translate-x-[-50%] blur-[10px] h-[56px]"
            style={{
              background:
                'linear-gradient(90deg, rgba(27, 27, 27, 0.00) 0%, rgba(255, 206, 82, 0.30) 50.96%, rgba(27, 27, 27, 0.00) 100%)',
            }}
            animate={{
              width: [400, 900, 400],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      )}
      {isMobile && (
        <div className="text-[16px] text-[#FFC42F] mt-[40px] mb-[20px]">
          Looking into <span className="text-[#37C2FF]">@{handle}</span>'s inner soul...
        </div>
      )}
      <div className={clsx(isMobile ? 'mt-[0px]' : 'mt-[40px]')}>
        {showRetryButton ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleRetry}
            className="mt-[20px] px-[32px] py-[12px] rounded-full bg-gradient-to-b from-[#FFCC49] to-[#564210] text-[#FFDB7E] text-[20px] font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-[0_0_10px_0_rgba(255,206,82,0.5)]"
          >
            Retry
          </motion.button>
        ) : (
          <ProgressBar isMobile={isMobile} />
        )}
      </div>
    </>
  )
}

const ProgressBar = ({ isMobile }: { isMobile: boolean }) => {
  const progressInnerRef = useRef<any>(null)
  const [progressWidth, setProgressWidth] = useState(0)
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const size = Math.random() * 2 + 1
        const delay = Math.random() * 0.3
        const duration = Math.random() * 0.6 + 0.4
        const angle = (Math.random() * 60 - 30) * (Math.PI / 180)
        const distance = 30 + Math.random() * 20
        const x = -Math.abs(Math.cos(angle) * distance)
        const y = Math.sin(angle) * distance
        const top = Math.random() * 12 - 6

        return {
          id: i,
          size,
          delay,
          duration,
          angle,
          distance,
          x,
          y,
          top,
          left: i * 2,
        }
      }),
    []
  )
  useEffect(() => {
    const startTime = Date.now()
    const maxProgress = 95

    const animateProgress = () => {
      const elapsed = Date.now() - startTime
      const progress = elapsed / 3000

      const easeOutQuart = 1 - Math.pow(1 - Math.min(progress, 0.95), 4)
      const currentWidth = easeOutQuart * maxProgress

      setProgressWidth(currentWidth)

      if (progress < 0.95) {
        requestAnimationFrame(animateProgress)
      }
    }

    requestAnimationFrame(animateProgress)

    return () => {
      setProgressWidth(100)
    }
  }, [])
  return (
    <div
      className={clsx(
        'mt-[10px]  h-[12px] rounded-[6px] border border-[#3E300E] bg-[#3F3F3F99] shadow-[0_2px_6px_0_rgba(0,0,0,0.25)_inset] relative',
        isMobile ? 'w-[348px]' : 'w-[390px]'
      )}
    >
      <motion.div
        ref={progressInnerRef}
        className={clsx(
          'h-[10px] rounded-[6px] relative',
          'bg-linear-to-r from-[#FFE9B2] via-[#FFC42F] to-[#F88E51]'
        )}
        initial={{ width: 0 }}
        animate={{
          width: `${progressWidth}%`,
        }}
      >
        <div className="absolute top-0 right-[-35px] w-[50px] h-[50px] flex items-center justify-center pointer-events-none">
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className={clsx('absolute rounded-full', 'bg-[#FFC42F]')}
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: `${particle.left}px`,
                top: `${particle.top}px`,
              }}
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0.3],
                x: [0, particle.x],
                y: [0, particle.y],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                repeatDelay: 0.1,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
