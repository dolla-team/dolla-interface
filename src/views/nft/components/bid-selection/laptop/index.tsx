import clsx from "clsx";
import { Bg1, Bg10, Bg5, Bg20 } from "./bgs";
import BidBtn from "./bid-btn";
// import ProvablyFair from "@/sections/provably-fair";
import { useAuth } from "@/contexts/auth";
import CashierEntry from "../../cashier-entery";
import ProbabilityBar from "./probability-bar";
import { useMemo, useState } from "react";
import Bg from "./bg";
import Big from "big.js";
import useWalletStore from "@/stores/use-wallet";

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
  // const [showProvablyFair, setShowProvablyFair] = useState(false);
  const { userInfo } = useAuth();
  const { set: walletSet } = useWalletStore();
  const [probability, probabilities] = useMemo(() => {
    if (!pool || !bids) return [0, [1, 5, 11, 30]];
    const rewardToken = pool.reward_token_info[0];
    const price = Big(pool.anchor_price).div(
      10 ** (rewardToken.decimals || 18)
    );

    let _p = Big(bids).div(price).mul(100);

    let _items = [1, 5, 11, 30];
    if (_p.gt(50)) {
      _items = [1, 11, 30, 50];
      _p = Big(50);
    } else if (_p.gt(30)) {
      _p = Big(30);
    }

    return [Math.max(Number(_p.toFixed(0)), 1), _items];
  }, [pool, bids]);

  return (
    <div className="absolute bottom-0 w-full h-[202px]">
      <Bg className="absolute bottom-0 left-0 w-full h-full" />
      <div className="relative flex items-center justify-center">
        <div className="w-[511px] relative pt-[30px] flex flex-col items-end pr-[6px]">
          <div className="flex justify-end gap-[60px] mb-[-16px]">
            <span className="text-[#999999] text-[16px] rotate-[-3deg] mt-[30px]">
              Probability
            </span>
            {probabilities.map((item, index) => (
              <span
                key={`probability-${item}`}
                className="text-[#999999] text-[16px] rotate-[-3deg]"
                style={{
                  marginTop: `${(4 - index) * 6}px`
                }}
              >
                {item}%
              </span>
            ))}
          </div>
          <ProbabilityBar
            probability={probability}
            probabilities={probabilities}
          />
        </div>
        <div className="mx-[20px] relative flex flex-col items-center justify-end">
          <BidBtn
            disabled={disabled || flipStatus === 4}
            onClick={onBidClick}
          />
          {userInfo && (
            <CashierEntry
              onClick={() =>
                walletSet({ showWallet: true, showUserInfo: false })
              }
              tokenBalance={tokenBalance}
            />
          )}
        </div>
        <div className="flex items-center gap-[10px] mt-[70px] text-white text-[22px] font-normal leading-[100%] uppercase">
          {[20, 10, 5, 1].map((item) => (
            <div
              key={`bids-${item}`}
              className={clsx(
                "relative flex items-center justify-center",
                item === 20 && "w-[133px] h-[68px]",
                item === 10 && "w-[120px] h-[62px]",
                item === 5 && "w-[118px] h-[56px]",
                item === 1 && "w-[110px] h-[47px]",
                disabled ? "opacity-50" : "button"
              )}
              onClick={() => onChangeBids(item)}
            >
              {item === 20 && <Bg20 active={bids === 20} />}
              {item === 10 && <Bg10 active={bids === 10} />}
              {item === 5 && <Bg5 active={bids === 5} />}
              {item === 1 && <Bg1 active={bids === 1} />}
              {/* {bids === 1 ? <Bg1 /> : <Bg1 />} */}
              <span
                className={clsx(
                  "relative z-[2]",
                  bids === item && "text-[#000]"
                )}
              >
                ${item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* {pool && (
        <ProvablyFair
          open={showProvablyFair}
          pool={pool}
          onClose={() => setShowProvablyFair(false)}
        />
      )} */}
    </div>
  );
}
