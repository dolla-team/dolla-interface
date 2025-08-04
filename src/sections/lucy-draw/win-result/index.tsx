import useClaim from "../use-claim";
import useUserWinnerList from "../use-user-winner-list";
import WinResultLaptop from "./laptop";
import WinResultMobile from "./mobile";
import useIsMobile from "@/hooks/use-is-mobile";

export default function LucyDraw({
  onShowHistory
}: {
  onShowHistory: (round: number) => void;
}) {
  const isMobile = useIsMobile();
  const { currentWinner, getCurrentWinner } = useUserWinnerList();
  const { claim, isClaiming } = useClaim({
    onClaimSuccess: getCurrentWinner
  });

  const params = {
    onShowHistory,
    isClaiming,
    currentWinner,
    claim
  };
  return isMobile ? (
    <WinResultMobile {...params} />
  ) : (
    <WinResultLaptop {...params} />
  );
}
