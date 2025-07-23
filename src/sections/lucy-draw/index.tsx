import { useEffect, useMemo, useRef, useState } from "react";
import Timer from "./timer";
import useUserInfoStore from "@/stores/use-user-info";
import LucyDrawHistory from "./history";
import WinResult from "./win-result";
import useLucyDraw from "./use-lucky-draw";
import { useConfigStore } from "@/stores/use-config";
import Bottoms from "./bottoms";
import BuyTicket from "./buy-ticket";
import useUserPrize from "@/hooks/use-user-prize";

export default function LucyDraw({
  tokenBalance,
  update
}: {
  tokenBalance: string;
  update: () => void;
}) {
  const userInfoStore = useUserInfoStore();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyRound, setHistoryRound] = useState(0);
  const { currentRound, isLoading, fetchCurrentRound } = useLucyDraw();
  const configStore = useConfigStore();
  const [status, setStatus] = useState(0); // 0: running, 1: drawing, 2: end
  const timerRef = useRef<any>(null);
  const [showBuyTicket, setShowBuyTicket] = useState(false);
  const [winningList, setWinningList] = useState<any[]>([]);
  const { getUserPrize } = useUserPrize();

  const tickets = useMemo(() => {
    return userInfoStore?.prize?.tickets > 99
      ? "99+"
      : userInfoStore?.prize?.tickets;
  }, [userInfoStore?.prize?.tickets]);

  const prizeAmount = useMemo(() => {
    if (!configStore.config?.ticket_prize) return 0;
    return configStore.config?.ticket_prize?.reduce(
      (acc: number, curr: any) => {
        return acc + curr.volume * curr.winner_count;
      },
      0
    );
  }, [configStore.config?.ticket_prize]);

  const fetchResult = async () => {
    try {
      const { winningList, number } = await fetchCurrentRound(currentRound);
      if (winningList.length > 0 || number === 0) {
        setStatus(2);
        setWinningList(winningList);
        setTimeout(async () => {
          await getUserPrize();
          await fetchCurrentRound();
          setStatus(0);
        }, 5 * 1000);
      } else {
        throw new Error("No winning list");
      }
    } catch (error) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        fetchResult();
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute top-[14%] right-[20px]">
      <WinResult
        onShowHistory={(_round: number) => {
          setIsHistoryOpen(true);
          setHistoryRound(_round);
        }}
      />
      <div className="w-[248px] border border-[#FFE9B2] rounded-[12px] bg-[#FFFFFF1A] overflow-hidden">
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
            <span className="text-[#FFE9B2] text-[12px]">#{currentRound}</span>
          </div>
          <div className="flex items-center justify-between mt-[4px]">
            <span className="text-[20px] font-[DelaGothicOne] text-white">
              ${prizeAmount.toLocaleString()}
            </span>
            <Timer
              onTimeUp={() => {
                setStatus(1);
                if (currentRound) fetchResult();
              }}
              currentRound={currentRound}
            />
          </div>
          <div className="flex items-center justify-between mt-[10px] text-[12px] text-[#FFE9B2]">
            <span>
              <span>Total Tickets</span>{" "}
              <span className="text-white">
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

        <div className="h-[60px] relative">
          <Bottoms
            status={status}
            tickets={tickets}
            onBuyTicket={() => setShowBuyTicket(true)}
            winningList={winningList}
          />
        </div>
      </div>
      <LucyDrawHistory
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyRound={historyRound}
        isLoading={isLoading}
        fetchCurrentRound={fetchCurrentRound}
        prizeAmount={prizeAmount}
        currentRound={currentRound}
      />
      <BuyTicket
        showBuyTicket={showBuyTicket}
        onClose={() => setShowBuyTicket(false)}
        tokenBalance={tokenBalance}
        update={update}
      />
    </div>
  );
}
