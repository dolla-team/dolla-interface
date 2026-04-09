import useIsMobile from "@/hooks/use-is-mobile";
import MobileBidSelection from "./mobile";
import LaptopBidSelection from "./laptop";
import { useNftContext } from "../../context";
import { useMemo } from "react";
import { useAuth } from '@/contexts/wallet'
import useDraw from "@/hooks/evm/use-draw";

export default function BidSelection({ tokenBalance }: any) {
  const { userInfo } = useAuth();
  const isMobile = useIsMobile();
  const {
    bids,
    setBids,
    flipStatus,
    pool,
    setFlipStatus,
    setBidResult,
    carouselRef
  } = useNftContext();

  const disabled = useMemo(() => {
    if (pool?.status !== 1) {
      return true;
    }
    if (!userInfo?.user) {
      return true;
    }
    if (Number(tokenBalance) < bids) {
      return true;
    }
    if (flipStatus === 0) {
      return false;
    }

    return true;
  }, [flipStatus, userInfo, tokenBalance, bids, pool]);

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

  const onChangeBids = (bids: number) => {
    if (flipStatus === 1 || disabled) return;
    setBids(bids);
  };

  const onBidClick = () => {
    if (disabled) {
      return;
    }

    setBidResult(null);
    carouselRef.current.handleRotate("play", { speed: 10 });

    setFlipStatus(1);
    onDraw(pool?.pool_id, bids);
  };

  const props = {
    tokenBalance,
    disabled,
    bids,
    flipStatus,
    onChangeBids,
    onBidClick,
    pool
  };

  return isMobile ? (
    <MobileBidSelection {...props} />
  ) : (
    <LaptopBidSelection {...props} />
  );
}
