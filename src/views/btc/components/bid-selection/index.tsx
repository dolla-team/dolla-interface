import useIsMobile from "@/hooks/use-is-mobile";
import MobileBidSelection from "./mobile";
import LaptopBidSelection from "./laptop";
import { useBtcContext } from "../../context";

export default function BidSelection({
  tokenBalance,
  disabled,
  balanceNotEnough,
  onBidClick
}: any) {
  const isMobile = useIsMobile();
  const { bids, setBids, flipStatus, pool } = useBtcContext();

  const onChangeBids = (bids: number) => {
    if (disabled) return;
    setBids(bids);
  };

  const props = {
    tokenBalance,
    disabled,
    bids,
    flipStatus,
    onChangeBids,
    onBidClick,
    pool,
    balanceNotEnough
  };

  return isMobile ? (
    <MobileBidSelection {...props} />
  ) : (
    <LaptopBidSelection {...props} />
  );
}
