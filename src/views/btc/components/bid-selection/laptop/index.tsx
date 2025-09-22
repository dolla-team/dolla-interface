import clsx from "clsx";
import { BalanceBg, Bg1, Bg100, Bg10, Bg5, Bg50, ProvablyFairBg } from "./bgs";
import BidBtn from "./bid-btn";
import AutoBtn from "./auto-btn";
import Points from "@/sections/points";
import { useAuth } from "@/contexts/auth";
import useWalletStore from "@/stores/use-wallet";
import CashierEntry from "../../cashier-entery";

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
  pool: string;
  flipStatus: number;
  onChangeBids: (bids: number) => void;
  onBidClick: () => void;
}) {
  const { userInfo } = useAuth();
  const { set } = useWalletStore();
  return (
    <div className="absolute bottom-0 left-[3%] w-full h-[202px] flex items-center justify-center">
      <div className="w-[192px] cursor-pointer h-[53px] relative top-[10px] flex items-center justify-center font-[BlackHanSans] relative">
        <ProvablyFairBg />
        {userInfo && (
          <CashierEntry
            onClick={(e: any) => {
              e.stopPropagation();
              set({
                showWallet: true,
                showUserInfo: false,
                panelType: "deposit"
              });
            }}
            tokenBalance={tokenBalance}
          />
        )}
      </div>
      <div className="w-[333px] h-[73px] relative font-[BlackHanSans]">
        <BalanceBg />
        <div className="flex items-center justify-between relative z-[2] mt-[26px] w-[84%] mx-auto">
          <div className="text-white text-[16px]">PTS</div>
          <Points />
        </div>
      </div>
      <div className="mx-[20px] relative flex flex-col items-center justify-center">
        {flipStatus !== 4 && (
          <BidBtn disabled={disabled} onClick={onBidClick} />
        )}
        {flipStatus === 4 && <AutoBtn />}
      </div>
      <div className="flex items-center text-white text-[22px] font-normal leading-[100%] uppercase font-[DelaGothicOne]">
        {[100, 50, 10, 5, 1].map((item) => (
          <div
            key={`bids-${item}`}
            className={clsx(
              "relative flex items-center justify-center",
              item === 100 && "w-[139px] h-[73px]",
              item === 50 && "w-[133px] h-[68px]",
              item === 10 && "w-[120px] h-[62px]",
              item === 5 && "w-[118px] h-[56px]",
              item === 1 && "w-[110px] h-[47px]",
              disabled ? "opacity-50" : "button"
            )}
            onClick={() => onChangeBids(item)}
          >
            {item === 100 && <Bg100 active={bids === 100} />}
            {item === 50 && <Bg50 active={bids === 50} />}
            {item === 10 && <Bg10 active={bids === 10} />}
            {item === 5 && <Bg5 active={bids === 5} />}
            {item === 1 && <Bg1 active={bids === 1} />}
            {/* {bids === 1 ? <Bg1 /> : <Bg1 />} */}
            <span
              className={clsx("relative z-[2]", bids === item && "text-[#000]")}
            >
              ${item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
