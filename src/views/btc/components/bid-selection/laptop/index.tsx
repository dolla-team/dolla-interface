import clsx from "clsx";
import { Bg, BalanceBg, Bg100, Bg50, Bg10, Bg1 } from "./bgs";
import BidBtn from "./bid-btn";
import Points from "@/sections/points";
import useWalletStore from "@/stores/use-wallet";
import CashierEntry from "../../cashier-entery";
import { useBtcContext } from "../../../context";
import { useAuth } from "@/contexts/auth";
import { useTipsStore } from "@/stores/use-tips";
import { QUOTE_TOKEN } from "@/config/btc";
import { motion, AnimatePresence } from "framer-motion";

export default function BidSelection({
  tokenBalance,
  disabled,
  bids,
  pool,
  flipStatus,
  onChangeBids,
  onBidClick
}: {
  tokenBalance: string;
  disabled: boolean;
  bids: number;
  pool: any;
  flipStatus: number;
  onChangeBids: (bids: number) => void;
  onBidClick: () => void;
}) {
  const tipsStore = useTipsStore();
  const { set } = useWalletStore();
  const { setFlipStatus } = useBtcContext();
  const { address, login } = useAuth();
  return (
    <div className="absolute bottom-0 left-0 w-full h-[202px]">
      <Bg className="absolute top-0 left-0 w-full h-full" />
      <div className="relative z-[10] flex items-center justify-center xl:gap-[100px] xl:scale-none gap-[80px] scale-[0.75]">
        <div className="flex items-center justify-end gap-[18px]">
          <div className="w-[254px] px-[20px] mt-[70px] h-[60px] border border-[#F2F2F233] rounded-[10px] bg-[#F2F2F21A] flex items-center justify-between">
            <span className="text-[16px] text-white">Credits</span>
            <Points />
          </div>
          <div className="flex items-center justify-center mt-[70px] relative w-[192px] h-[62px]">
            <BalanceBg />
            <CashierEntry
              onClick={(e: any) => {
                e.stopPropagation();
                if (!address) {
                  login();
                  return;
                }
                set({
                  showWallet: true,
                  panelType: "deposit",
                  depositPanelType: "input",
                  selectedToken: QUOTE_TOKEN
                });
              }}
              tokenBalance={tokenBalance}
            />
          </div>
        </div>

        <BidBtn
          disabled={disabled}
          onClick={() => {
            if (flipStatus === 4) {
              setFlipStatus(5);
              return;
            }
            tipsStore.set({ step: 0 });
            onBidClick();
          }}
        />

        <div className="flex items-end text-black text-[18px] font-normal leading-[100%] uppercase mt-[60px]">
          {[1, 10, 50, 100].map((item) => (
            <div
              key={`bids-${item}`}
              className={clsx(
                "relative flex items-center justify-center button",
                item === 100 && "w-[115px] h-[73px]",
                item === 50 && "w-[114px] h-[65px]",
                item === 10 && "w-[114px] h-[61px]",
                item === 1 && "w-[124px] h-[53px]",
                pool?.status !== 1 ? "opacity-50" : "button"
              )}
              id={`tips-bid-selection-${item}`}
              onClick={() => {
                onChangeBids(item);
                if (tipsStore.step === 2) {
                  tipsStore.set({ step: 3 });
                }
              }}
            >
              {item === 100 && <Bg100 active={bids === 100} />}
              {item === 50 && <Bg50 active={bids === 50} />}
              {item === 10 && <Bg10 active={bids === 10} />}
              {item === 1 && <Bg1 active={bids === 1} />}
              <span
                className={clsx(
                  "relative z-[2]",
                  bids === item ? "text-[#000]" : "text-[#DCDCDC]"
                )}
              >
                ${item}
              </span>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {bids === 1 && (
          <motion.img
            key="bid-1"
            src="/btc/bid1.png"
            alt="bid 1"
            className="w-[282px] h-[239px] absolute bottom-[40px] left-[calc(50%-120px)] xl:scale-none scale-[0.75]"
            initial={{
              opacity: 0,
              scale: 0.3,
              rotate: -45,
              x: -100,
              y: 100
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              x: 0,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.3,
              rotate: 45,
              x: 100,
              y: 100
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
          />
        )}
        {bids === 10 && (
          <motion.img
            key="bid-10"
            src="/btc/bid10.png"
            alt="bid 10"
            className="w-[331px] h-[194px] absolute bottom-[70px] left-[calc(50%-150px)] xl:scale-none scale-[0.75]"
            initial={{
              opacity: 0,
              scale: 0.3,
              rotate: -45,
              x: -100,
              y: 100
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              x: 0,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.3,
              rotate: 45,
              x: 100,
              y: 100
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
          />
        )}
        {bids === 50 && (
          <motion.img
            key="bid-50"
            src="/btc/bid50.png"
            alt="bid 50"
            className="w-[272px] h-[225px] absolute bottom-[64px] left-[calc(50%-130px)] xl:scale-none scale-[0.75]"
            initial={{
              opacity: 0,
              scale: 0.3,
              rotate: -45,
              x: -100,
              y: 100
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              x: 0,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.3,
              rotate: 45,
              x: 100,
              y: 100
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
          />
        )}
        {bids === 100 && (
          <motion.img
            key="bid-100"
            src="/btc/bid100.png"
            alt="bid 100"
            className="w-[289px] h-[198px] absolute bottom-[80px] left-[calc(50%-130px)] xl:scale-none scale-[0.75]"
            initial={{
              opacity: 0,
              scale: 0.3,
              rotate: -45,
              x: -100,
              y: 100
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
              x: 0,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.3,
              rotate: 45,
              x: 100,
              y: 100
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
