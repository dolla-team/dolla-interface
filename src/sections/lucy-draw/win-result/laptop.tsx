import WinResultContent from "./content";
import useClaim from "../use-claim";
import useUserWinnerList from "../use-user-winner-list";
import useLuckyDrawStore from "@/stores/use-lucky-draw";

export default function WinResult() {
  const lucyDrawStore = useLuckyDrawStore();
  const { claim, isClaiming } = useClaim({
    onClaimSuccess: () => {
      getCurrentWinner();
    }
  });
  const { currentWinner, getCurrentWinner } = useUserWinnerList();

  return (
    currentWinner && (
      <WinResultContent
        onShowHistory={() => {
          lucyDrawStore.set({
            showHistory: true,
            historyRound: currentWinner.prize_draw_id
          });
        }}
        isClaiming={isClaiming}
        currentWinner={currentWinner}
        claim={claim}
      />
    )
  );
}
