import clsx from "clsx";
import { Bg, BalanceBg, Bg100, Bg50, Bg10, Bg1 } from "./bgs";
import BidBtn from "./bid-btn";
import Points from "@/sections/points";
import useWalletStore from "@/stores/use-wallet";
import CashierEntry from "../../cashier-entery";
import { useBtcContext } from "../../../context";
import { useAuth } from "@/contexts/auth";

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
  const { set } = useWalletStore();
  const { setFlipStatus } = useBtcContext();
  const { address, login } = useAuth();
  return (
    <div className="absolute bottom-0 left-0 w-full h-[202px]">
      <Bg className="absolute top-0 left-0 w-full h-full" />
      <div className="relative z-[10] flex items-center justify-center">
        <div className="flex items-center justify-end gap-[18px]">
          <div className="w-[254px] px-[20px] mt-[20px] h-[60px] border border-[#F2F2F233] rounded-[10px] bg-[#F2F2F21A] flex items-center justify-between">
            <span className="text-[16px] text-white">PTS</span>
            <Points />
          </div>
          <div className="flex items-center justify-center mt-[30px] relative w-[192px] h-[62px]">
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
                  panelType: "deposit"
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
            onBidClick();
          }}
        />

        <div className="flex items-end text-black text-[18px] font-normal leading-[100%] uppercase mt-[10px]">
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
              onClick={() => onChangeBids(item)}
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
    </div>
  );
}
