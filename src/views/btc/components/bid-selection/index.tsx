import useIsMobile from "@/hooks/use-is-mobile";
import MobileBidSelection from "./mobile";
import LaptopBidSelection from "./laptop";
import { useBtcContext } from "../../context";
import { useMemo } from "react";
import { useAuth } from "@/contexts/auth";
import useBid from "@/hooks/solana/use-bid";

export default function BidSelection({ tokenBalance, update }: any) {
  const { userInfo } = useAuth();
  const isMobile = useIsMobile();
  const {
    bids,
    setBids,
    flipStatus,
    pool,
    setFlipStatus,
    setBidResult,
    onReset
  } = useBtcContext();

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
    if (flipStatus === 0 || flipStatus === 6) {
      return false;
    }
    return true;
  }, [flipStatus, userInfo, tokenBalance, bids, pool]);

  const { onBid } = useBid(
    pool?.pool_id,
    (result) => {
      console.log("complete success");
      setFlipStatus(4);
      setBidResult(result);
    },
    () => {
      console.log("bid success");
      setFlipStatus(2);
      update();
    },
    () => {
      console.log("bid fail");
      setTimeout(() => {
        setFlipStatus(0);
      }, 30);
    }
  );

  const onChangeBids = (bids: number) => {
    if (flipStatus === 1) return;
    setBids(bids);
  };

  const onBidClick = () => {
    console.log("onBidClick", disabled);
    if (disabled) {
      return;
    }
    if (flipStatus === 6) {
      onReset();
    }
    setBidResult(null);
    setFlipStatus(1);
    onBid(bids);
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
