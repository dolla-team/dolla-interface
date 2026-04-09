import { motion, AnimatePresence } from 'framer-motion'
import Actions from './actions'
import Level from './level'
import Info from './info'
import StarterObjectives from './starter-objectives'
import { useAuth } from '@/contexts/wallet'
import { useGlobalStore } from '@/stores/use-global'
import useWalletStore from '@/stores/use-wallet'

export default function Laptop() {
  const globalStore = useGlobalStore()
  const walletStore = useWalletStore()
  const { userInfo } = useAuth()

  return (
    <>
      {/* Main panel with slide animation */}
      <AnimatePresence>
        {globalStore.showUserInfo && (
          <motion.div
            initial={{ x: 294 }}
            animate={{ x: 0 }}
            exit={{ x: 294 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.3,
            }}
            className="fixed bottom-0 right-0 z-[5] w-[294px] bg-[#1C1C23]"
            onClick={(e: any) => {
              e.stopPropagation()
            }}
            style={{
              height: walletStore.showInfos ? 'calc(100% - 96px)' : 'calc(100% - 60px)',
            }}
          >
            <div className="pt-[20px]">
              <Info />

              <div className="flex justify-between items-center text-white mt-[26px] px-[20px]">
                <div className="text-[10px]">Total bid</div>
                <div className="text-[12px] font-medium">${userInfo?.player_total_bid}</div>
              </div>
              <div className="flex justify-between items-center text-white mt-[10px] px-[20px] pb-[10px] border-b border-[#313038]">
                <div className="text-[10px]">Bid Times</div>
                <div className="text-[12px] font-medium">{userInfo?.played_number}</div>
              </div>
              <Level />
            </div>
            <StarterObjectives />
            <Actions />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
