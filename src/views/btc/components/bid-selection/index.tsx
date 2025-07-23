import clsx from "clsx";
import AddBtn from "./add-btn";
import { BalanceBg, Bg1, Bg100, Bg10, Bg5, Bg50, ProvablyFairBg } from "./bgs";
import Cashier from "@/sections/cashier/modal";
import { useMemo, useState } from "react";
import { useBtcContext } from "../../context";
import BidBtn from "../bid-btn";
import AutoBtn from "./auto-btn";
import ProvablyFair from "@/sections/provably-fair";
import { formatNumber } from "@/utils/format/number";
import { useAuth } from "@/contexts/auth";

export default function BidSelection({
  tokenBalance,
  update
}: {
  tokenBalance: string;
  update: () => void;
}) {
  const [showCashier, setShowCashier] = useState(false);
  const [showProvablyFair, setShowProvablyFair] = useState(false);
  const { bids, setBids, flipStatus, pool } = useBtcContext();
  const { address } = useAuth();
  const onChangeBids = (bids: number) => {
    if (flipStatus === 1) return;
    setBids(bids);
  };

  const isDisabled = useMemo(() => {
    if (flipStatus !== 0 && flipStatus !== 6) return true;
    if (pool?.status !== 1) return true;
    return false;
  }, [flipStatus, pool]);

  return (
    <div className="absolute bottom-0 left-[3%] w-full h-[202px] flex items-center justify-center">
      <div
        onClick={() => setShowProvablyFair(true)}
        className="w-[192px] cursor-pointer h-[53px] relative top-[10px] flex items-center justify-center font-[BlackHanSans]"
      >
        <ProvablyFairBg />
        <span className="text-white text-[16px] mt-[10px] leading-[16px]">
          Provably fair
        </span>
      </div>
      <div className="w-[333px] h-[73px] relative font-[BlackHanSans]">
        <BalanceBg />
        <div className="flex items-center justify-between relative z-[2] mt-[26px] w-[80%] mx-auto">
          <div className="text-white text-[16px]">BALANCE</div>
          <div className="text-white text-[20px] flex items-center gap-[10px]">
            <span>${formatNumber(tokenBalance || "0", 2, true)}</span>
            {address && <AddBtn onClick={() => setShowCashier(true)} />}
          </div>
        </div>
      </div>
      <div className="mx-[20px] relative flex flex-col items-center justify-center">
        {flipStatus !== 4 && (
          <BidBtn
            tokenBalance={tokenBalance}
            onBidSuccess={() => {
              update();
            }}
          />
        )}
        {flipStatus === 4 && <AutoBtn />}
      </div>
      <div className="flex items-center text-white text-[22px] font-normal leading-[100%] uppercase font-[DelaGothicOne]">
        {[100, 50, 10, 5, 1].map((item) => (
          <div
            key={`bids-${item}`}
            className={clsx(
              "relative flex items-center justify-center button",
              item === 100 && "w-[139px] h-[73px]",
              item === 50 && "w-[133px] h-[68px]",
              item === 10 && "w-[120px] h-[62px]",
              item === 5 && "w-[118px] h-[56px]",
              item === 1 && "w-[110px] h-[47px]",
              isDisabled ? "opacity-50" : "button"
            )}
            onClick={() => onChangeBids(item)}
          >
            {item === 100 && <Bg100 />}
            {item === 50 && <Bg50 />}
            {item === 10 && <Bg10 />}
            {item === 5 && <Bg5 />}
            {item === 1 && <Bg1 />}
            {/* {bids === 1 ? <Bg1 /> : <Bg1 />} */}
            <span
              className={clsx(
                "relative z-[2]",
                bids === item && "text-[#FFEF43]"
              )}
              style={{
                WebkitTextStroke: bids === item ? "2px #5E3737" : "none"
              }}
            >
              ${item}
            </span>
          </div>
        ))}
      </div>
      <Cashier open={showCashier} onClose={() => setShowCashier(false)} />
      <ProvablyFair
        open={showProvablyFair}
        onClose={() => setShowProvablyFair(false)}
      />
    </div>
  );
}
