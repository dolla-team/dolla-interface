import WinResult from "./win-result";
import LucyDrawCard from "./card";

export default function LucyDraw(props: any) {
  const { setIsHistoryOpen, setHistoryRound, currentRound } = props;
  return (
    <>
      <WinResult
        onShowHistory={(_round: number) => {
          setIsHistoryOpen(true);
          setHistoryRound(_round);
        }}
        key={currentRound}
      />
      <LucyDrawCard {...props} />
    </>
  );
}
