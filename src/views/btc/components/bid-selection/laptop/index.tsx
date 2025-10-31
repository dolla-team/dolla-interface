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
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import { BID_UNITS } from "@/config";

const animate: any = {
  initial: {
    opacity: 0,
    scale: 0.3,
    rotate: -45,
    x: -100,
    y: 100
  },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    x: 0,
    y: 0
  },
  exit: {
    opacity: 0,
    scale: 0.3,
    rotate: 45,
    x: 100,
    y: 100
  },
  transition: {
    duration: 0.5,
    ease: "easeOut"
  }
};

export default function BidSelection({
  tokenBalance,
  disabled,
  balanceNotEnough,
  bids,
  pool,
  flipStatus,
  onChangeBids,
  onBidClick
}: {
  tokenBalance: string;
  disabled: boolean;
  balanceNotEnough: boolean;
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
          <div className="w-[254px] px-[10px] mt-[70px] h-[60px] border border-[#F2F2F233] rounded-[10px] bg-[#F2F2F21A] flex items-center justify-between">
            <div className="flex items-center gap-[6px]">
              <span className="text-[16px] text-white">Credits</span>
              <CreditsInfo />
            </div>
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
          balanceNotEnough={balanceNotEnough}
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
          {BID_UNITS.map((item) => (
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
            src={balanceNotEnough ? "/btc/bid1-disabled.png" : "/btc/bid1.png"}
            alt="bid 1"
            className={clsx(
              "w-[282px] h-[239px] absolute bottom-[60px] left-[calc(50%-120px)] xl:scale-none scale-[0.75]"
            )}
            {...animate}
          />
        )}
        {bids === 10 && (
          <motion.img
            key="bid-10"
            src={
              balanceNotEnough ? "/btc/bid10-disabled.png" : "/btc/bid10.png"
            }
            alt="bid 10"
            className={clsx(
              "w-[331px] h-[194px] absolute bottom-[110px] left-[calc(50%-150px)] xl:scale-none scale-[0.75]"
            )}
            {...animate}
          />
        )}
        {bids === 50 && (
          <motion.img
            key="bid-50"
            src={
              balanceNotEnough ? "/btc/bid50-disabled.png" : "/btc/bid50.png"
            }
            alt="bid 50"
            className={clsx(
              "w-[272px] h-[225px] absolute bottom-[84px] left-[calc(50%-130px)] xl:scale-none scale-[0.75]"
            )}
            {...animate}
          />
        )}
        {bids === 100 && (
          <motion.img
            key="bid-100"
            src={
              balanceNotEnough ? "/btc/bid100-disabled.png" : "/btc/bid100.png"
            }
            alt="bid 100"
            className={clsx(
              "w-[289px] h-[198px] absolute bottom-[100px] left-[calc(50%-130px)] xl:scale-none scale-[0.75]"
            )}
            {...animate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const CreditsInfo = () => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.TopLeft}
      content={
        <div className="w-[298px] text-[12px] p-[10px] bg-white rounded-[10px] border border-[#E4E4E4]">
          <div className="font-[500] text-black">Credits</div>
          <div className="text-[12px] text-[#5E6B7D] font-[300] mt-[4px] leading-[120%]">
            Credits can only be obtained through market bidding, and can be
            exchanged for USDT or bid chances.
          </div>
        </div>
      }
    >
      <button className="relative transition-opacity button flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8 16C3.582 16 0 12.418 0 8C0 3.582 3.582 0 8 0C12.418 0 16 3.582 16 8C16 12.418 12.418 16 8 16ZM8 14.6667C11.682 14.6667 14.6667 11.682 14.6667 8C14.6667 4.318 11.682 1.33333 8 1.33333C4.318 1.33333 1.33333 4.318 1.33333 8C1.33333 11.682 4.318 14.6667 8 14.6667ZM7.33333 7.33333C7.33333 7.15652 7.40357 6.98695 7.5286 6.86193C7.65362 6.7369 7.82319 6.66667 8 6.66667C8.17681 6.66667 8.34638 6.7369 8.4714 6.86193C8.59643 6.98695 8.66667 7.15652 8.66667 7.33333V12C8.66667 12.1768 8.59643 12.3464 8.4714 12.4714C8.34638 12.5964 8.17681 12.6667 8 12.6667C7.82319 12.6667 7.65362 12.5964 7.5286 12.4714C7.40357 12.3464 7.33333 12.1768 7.33333 12V7.33333ZM7.93333 5.2C7.6858 5.2 7.4484 5.10167 7.27337 4.92663C7.09833 4.7516 7 4.5142 7 4.26667C7 4.01913 7.09833 3.78173 7.27337 3.6067C7.4484 3.43167 7.6858 3.33333 7.93333 3.33333C8.18087 3.33333 8.41827 3.43167 8.5933 3.6067C8.76833 3.78173 8.86667 4.01913 8.86667 4.26667C8.86667 4.5142 8.76833 4.7516 8.5933 4.92663C8.41827 5.10167 8.18087 5.2 7.93333 5.2Z"
            fill="#8A87AA"
          />
        </svg>
      </button>
    </Popover>
  );
};
