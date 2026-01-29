import DollaEye from '@/components/dolla-eye'
import { motion } from 'framer-motion'
import { LineIcon } from './icons'
import AnalyzePanel from './analyze-panel'
import BlackholeBg from './bg'
import LoginPanel from './login-panel'
import { useVerifyStore } from '@/stores/use-verify'
import SocialLinks from './social-links'

export default function VerifyEmail() {
  const { hasAccount, isBgSpread, set } = useVerifyStore()

  const onChangeHasAccount = (value: boolean) => {
    set({ hasAccount: value })
  }

  const setIsBgSpread = (value: boolean) => {
    set({ isBgSpread: value })
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden" id="verify-email-container">
      <div
        className="w-full h-full flex items-end justify-center gap-[30px] relative z-[2] overflow-hidden"
        style={{
          background:
            'radial-gradient(27.11% 21.64% at 74.31% 34.42%, rgba(255, 196, 47, 0.40) 0%, rgba(255, 196, 47, 0.00) 100%), #000',
        }}
      >
        <div className="w-full h-full pointer-events-none overflow-hidden absolute top-0 left-0 opacity-[0.07]">
          <motion.div
            className="w-[500%] h-[500%] bg-[url('/bg-noise.png')] [inset:-200%] absolute will-change-transform"
            animate={{
              translateX: [0, '-5%', '5%', '-10%', '10%', '-15%', '15%', 0],
              translateY: [0, '15%', '-15%', '10%', '-10%', '5%', '-5%', 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
        <div className="w-[613px] h-[420px] relative shrink-1 z-[2]">
          <img src="/verify/verify-woman.png" className="w-full h-full object-cover" />
          <motion.img
            src="/verify/verify-usdt.png"
            className="absolute top-[60px] left-[10px] w-[76px] h-[89px] object-cover"
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
            className="absolute top-[-360px] right-[-60px] w-[245px] h-[244px] object-cover"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <LineIcon className="absolute left-[60px] top-[-230px] w-[343px] h-[248px]" />
        </div>
        <div className="pb-[40px] w-[780px] shrink-0 relative">
          <BlackholeBg isSpread={isBgSpread} />
          <div className="flex flex-col items-center relative z-[2]">
            <DollaEye className="" height={86} />
            {hasAccount ? (
              <LoginPanel
                onChangeHasAccount={onChangeHasAccount}
                setIsBgSpread={setIsBgSpread}
                hasAccount={hasAccount}
              />
            ) : (
              <AnalyzePanel
                hasAccount={hasAccount}
                setIsBgSpread={setIsBgSpread}
                onChangeHasAccount={onChangeHasAccount}
              />
            )}
            <SocialLinks className="absolute bottom-[0px] w-full flex items-center justify-center gap-[50px] pr-[30px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
