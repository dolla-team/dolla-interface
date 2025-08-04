import Bottoms from "./bottoms";
import Timer from "./timer";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";

export default function LucyDrawCard({
  currentRound,
  prizeAmount,
  status,
  tickets,
  winningList,
  setStatus,
  fetchResult,
  userInfoStore,
  setShowBuyTicket,
  setIsHistoryOpen
}: any) {
  const isMobile = useIsMobile();
  return (
    <div
      className={clsx(
        "border border-[#FFE9B2] overflow-hidden",
        isMobile
          ? "w-full rounded-t-[16px] pt-[12px]"
          : "w-[248px] rounded-[12px] bg-[#FFFFFF1A]"
      )}
    >
      <div className="z-[5] relative backdrop-filter-[10px] bg-black/50 px-[16px] pt-[2px] pb-[10px] rounded-t-[12px]">
        <div className="flex items-center justify-between">
          <span
            className="text-white font-[DelaGothicOne] text-[24px]"
            style={{
              textShadow: "0px 0px 30px #8465FF",
              WebkitTextStroke: "1px #3A3A3A"
            }}
          >
            Lucky Draw
          </span>
          <div className="text-black text-[14px] px-[8px] bg-[#FFE9B2] rounded-[12px] font-semibold bg-linear-to-r from-[#FFE9B2] to-[#FFC42F]">
            #{currentRound}
          </div>
        </div>
        <div
          className={clsx(
            "flex items-center justify-between",
            isMobile ? "mt-[10px]" : "mt-[4px]"
          )}
        >
          <div>
            {isMobile && (
              <div className="text-[#FFE9B2] text-[14px]">
                Prize for {currentRound}
              </div>
            )}
            <span className="text-[20px] font-[DelaGothicOne] text-white">
              ${prizeAmount.toLocaleString()}
            </span>
          </div>
          <Timer
            onTimeUp={() => {
              if (currentRound) {
                setStatus(1);
                fetchResult();
              }
            }}
            currentRound={currentRound}
            className={
              isMobile ? "w-[180px] h-[46px] px-[26px] text-[16px]" : ""
            }
            size={isMobile ? 22 : 14}
            key={currentRound}
          />
        </div>
        <div
          className={clsx(
            "flex items-center justify-between mt-[10px] text-[#FFE9B2]",
            isMobile ? "text-[14px]" : "text-[12px]"
          )}
        >
          <span>
            <span>Total Tickets</span>{" "}
            <span className={clsx("text-white", isMobile ? "text-[16px]" : "")}>
              {userInfoStore?.prize?.tickets}
            </span>
          </span>
          <button
            className="button underline"
            onClick={() => setIsHistoryOpen(true)}
          >
            History
          </button>
        </div>
      </div>

      <div className={clsx("relative", isMobile ? "h-[110px]" : "h-[70px]")}>
        <Bottoms
          status={status}
          tickets={tickets}
          onBuyTicket={() => setShowBuyTicket(true)}
          winningList={winningList}
        />
      </div>
    </div>
  );
}
