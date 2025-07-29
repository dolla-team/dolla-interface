import WinResult from "./win-result";
import LucyDrawCard from "./card";

export default function LucyDraw(props: any) {
  const { setIsHistoryOpen, setHistoryRound, currentRound } = props;
  return (
    <div className="absolute top-[14%] right-[20px] z-[10]">
      <WinResult
        onShowHistory={(_round: number) => {
          setIsHistoryOpen(true);
          setHistoryRound(_round);
        }}
        key={currentRound}
      />
      <LucyDrawCard {...props} />
    </div>
  );
}
