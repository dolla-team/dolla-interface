import NftCard from "../components/nft-card";
import Info from "./info";
import useDraw from "@/hooks/evm/use-draw";
import { useNftContext } from "../context";
import { useMemo } from "react";
import { useAuth } from "@/contexts/auth";
import BidsInfo from "../components/bids-info";
import TotalBid from "./total-bid";
import PlayerDistribution from "./player-distribution";
import Big from "big.js";

export default function NftContent() {
  const {
    setFlipStatus,
    setBidResult,
    carouselRef,
    pool,
    quoteTokenBalance,
    bids,
    flipStatus
  } = useNftContext();
  const { userInfo } = useAuth();
  const { onDraw } = useDraw(
    (isWinner: boolean) => {
      setFlipStatus(2);

      carouselRef.current.handleRotate("rotate", {
        target: isWinner ? 0 : Math.floor(Math.random() * 14) + 4
      });
      setTimeout(() => {
        setBidResult({ isWinner });
        if (!isWinner) {
          setFlipStatus(0);
        }
      }, 3000);
    },
    () => {
      console.log("bid fail");
      setTimeout(() => {
        setFlipStatus(0);
        carouselRef.current.handleRotate("pause");
      }, 30);
    }
  );

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

  const disabled = useMemo(() => {
    if (pool?.status !== 1) {
      return true;
    }
    if (!userInfo?.user) {
      return true;
    }
    if (Number(quoteTokenBalance) < bids) {
      return true;
    }
    if (flipStatus === 0) {
      return false;
    }

    return true;
  }, [flipStatus, userInfo, quoteTokenBalance, bids, pool]);

  const [rewardTokenInfo] = useMemo(() => {
    if (!pool) return [{}];

    return [pool.reward_token_info?.[0]];
  }, [pool]);

  const onBidClick = () => {
    if (disabled) {
      return;
    }

    setBidResult(null);
    carouselRef.current.handleRotate("play", { speed: 10 });

    setFlipStatus(1);
    onDraw(pool?.pool_id, bids);
  };

  return (
    <div className="flex mt-[20px]">
      <NftCard probability={probability} rewardTokenInfo={rewardTokenInfo} />
      <div>
        <div className="pl-[50px]">
          <Info
            onBidClick={onBidClick}
            disabled={disabled}
            probability={probability}
            probabilities={probabilities}
            rewardTokenInfo={rewardTokenInfo}
          />
        </div>
        <BidsInfo />
        <div className="mt-[18px] flex gap-[20px] pl-[50px]">
          <TotalBid />
          <PlayerDistribution />
        </div>
      </div>
    </div>
  );
}
