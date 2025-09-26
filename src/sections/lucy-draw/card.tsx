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
  setShowBuyTicket,
  setIsHistoryOpen,
  participation
}: any) {
  const isMobile = useIsMobile();
  return (
    <div
      className={clsx(
        "border border-[#F2F2F233] overflow-hidden w-full",
        isMobile
          ? "rounded-t-[16px] pt-[12px]"
          : "rounded-[12px] bg-[url('/lucky-draw.png')] bg-[#1C1C23] bg-no-repeat bg-center bg-cover"
      )}
    >
      <div className="z-[5] relative backdrop-filter-[10px] px-[16px] pt-[2px] pb-[10px] rounded-t-[12px]">
        <div className="flex items-center justify-between">
          <span
            className="text-white text-[24px] font-[800]"
            style={{
              textShadow: "0px 0px 10px #FFC42F"
            }}
          >
            Lucky Draw
          </span>
          <div className="text-black text-[10px] px-[8px] py-[3px] bg-[#FFC42F] rounded-[12px]">
            #{currentRound}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div
            className={clsx(
              "flex items-center gap-[14px]",
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
          <button
            className="button underline text-white text-[12px]"
            onClick={() => setIsHistoryOpen(true)}
          >
            History
          </button>
        </div>
        {/* <div
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
        </div> */}
      </div>

      <div className={clsx("relative", isMobile ? "h-[110px]" : "h-[70px]")}>
        <Bottoms
          status={status}
          tickets={tickets}
          onBuyTicket={() => setShowBuyTicket(true)}
          winningList={winningList}
          participation={participation}
        />
      </div>
    </div>
  );
}
