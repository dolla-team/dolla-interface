import useIsMobile from "@/hooks/use-is-mobile";
import LucyDrawMobile from "./mobile";
import LucyDrawLaptop from "./laptop";
import useUserPrize from "@/hooks/use-user-prize";
import useLucyDraw from "./use-lucky-draw";
import { useConfigStore } from "@/stores/use-config";
import useUserInfoStore from "@/stores/use-user-info";
import { useEffect, useMemo, useRef, useState } from "react";
import LucyDrawHistory from "./history";
import BuyTicket from "./buy-ticket";

export default function LucyDraw({
  tokenBalance,
  className
}: {
  tokenBalance: string;
  className?: string;
}) {
  const isMobile = useIsMobile();
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
        }, 10 * 1000);
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
  const params = {
    setIsHistoryOpen,
    setHistoryRound,
    currentRound,
    prizeAmount,
    status,
    tickets,
    winningList,
    setShowBuyTicket,
    userInfoStore,
    fetchResult,
    setStatus,
    className
  };
  return (
    <>
      {isMobile ? (
        <LucyDrawMobile {...params} />
      ) : (
        <LucyDrawLaptop {...params} />
      )}
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
      />
    </>
  );
}
