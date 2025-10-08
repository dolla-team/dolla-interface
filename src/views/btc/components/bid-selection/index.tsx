import useIsMobile from "@/hooks/use-is-mobile";
import MobileBidSelection from "./mobile";
import LaptopBidSelection from "./laptop";
import { useBtcContext } from "../../context";
import { useMemo } from "react";
import { useAuth } from "@/contexts/auth";
import useBid from "@/hooks/near/use-bid";
import { BET_UNIT } from "@/config";
import { useContractConfigStore } from "@/stores/use-contract-config";

export default function BidSelection({ tokenBalance }: any) {
  const { userInfo, onQueryUserInfo } = useAuth();
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

  const contractConfig = useContractConfigStore((state) => state.config);

  const disabled = useMemo(() => {
    if (pool?.status !== 1) {
      return true;
    }
    if (!userInfo?.user) {
      return true;
    }

    if (
      Number(tokenBalance) <
      bids * (Number(BET_UNIT) / 1e6) + contractConfig.play_game_fee
    ) {
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
      setFlipStatus(4);
      setBidResult(result);
      console.log("success", 4);
    },
    () => {
      setFlipStatus(2);
      console.log("tx success", 2);
      onQueryUserInfo();
    },
    () => {
      setTimeout(() => {
        setFlipStatus(0);
        console.log("tx fail", 0);
      }, 30);
    }
  );

  const onChangeBids = (bids: number) => {
    if (flipStatus === 1) return;
    setBids(bids);
  };

  const onBidClick = () => {
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
