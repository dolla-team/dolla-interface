import clsx from "clsx";
import Round from "../round";
import Timer from "../timer";

export default function HomeEntry({
  prizeAmount,
  currentRound,
  status,
  setStatus,
  fetchResult,
  winningAmount,
  onShowDetail
}: any) {
  return (
    <div
      className="fixed z-[10] top-[120px] cursor-pointer left-[10px] w-[156px] h-[146px]"
      onClick={onShowDetail}
    >
      <Round size={130} status={status} />
      <div className="relative z-[2] w-[130px] h-[130px] flex flex-col items-center justify-center">
        <div className="w-[110px] h-[40px] bg-[url('/lucky-draw/lucky-draw.png')] bg-no-repeat bg-center bg-contain" />
        <div className="mt-[3px] text-white text-center text-[20px] font-extrabold leading-[20px] [text-shadow:0_4px_0_#361089]">
          ${prizeAmount?.toLocaleString()}
        </div>
      </div>
      <div
        className={clsx(
          "absolute z-[3]",
          status === 2 &&
            winningAmount > 0 &&
            "w-[152px] h-[56px] bottom-[-6px] left-[-7px] rounded-[30px] bg-[url('/lucky-draw/winner-bg.png')] bg-no-repeat bg-center bg-cover",
          status === 2 &&
            winningAmount === 0 &&
            "w-[138px] h-[36px] bottom-[4px] left-0 border border-[#FFFFFF33] bg-[#8A87AA] rounded-[30px] backdrop-blur-[25px]",
          status !== 2 &&
            "w-[138px] h-[36px] bottom-[4px] left-0 border border-[#FFFFFF33] bg-[#5C03C24D] rounded-[30px] backdrop-blur-[25px]"
        )}
      >
        {status === 0 && (
          <Timer
            onTimeUp={() => {
              if (currentRound) {
                setStatus(1);
                fetchResult();
              }
            }}
            className="text-[12px] px-[2px]"
            currentRound={currentRound}
            size={16}
            key={currentRound}
          />
        )}
        {status === 1 && (
          <div className="text-[12px] text-white text-center leading-[34px]">
            Drawing...
          </div>
        )}
        {status === 2 &&
          (winningAmount > 0 ? (
            <div className="text-[12px] text-black leading-[54px] font-[600] text-center">
              You win ${winningAmount.toLocaleString()}!
            </div>
          ) : (
            <div className="text-[12px] text-white text-center leading-[34px]">
              You Missed
            </div>
          ))}
      </div>
      <div className="absolute top-[0px] left-[0px] w-[39px] h-[28px] bg-[url('/lucky-draw/one-ticket-icon.png')] bg-no-repeat bg-center bg-contain" />
      <div className="absolute bottom-[10px] right-[10px] w-[61px] h-[58px] bg-[url('/lucky-draw/two-tickets-icon.png')] bg-no-repeat bg-center bg-contain" />
    </div>
  );
}
