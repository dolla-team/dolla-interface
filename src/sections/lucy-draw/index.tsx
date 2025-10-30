import useUserPrize from "@/hooks/use-user-prize";
import useLucyDraw from "./use-lucky-draw";
import { useConfigStore } from "@/stores/use-config";
import useUserInfoStore from "@/stores/use-user-info";
import { useEffect, useMemo, useRef, useState } from "react";
import LucyDrawHistory from "./history";
import BuyTicket from "./buy-ticket";
import DetailModal from "./detail-modal";
import useLuckyDrawStore from "@/stores/use-lucky-draw";
import HomeEntry from "./home-entry";
import BtcDetailEntry from "./btc-detail-entry";
import Big from "big.js";
import { useAuth } from "@/contexts/auth";

export default function LucyDraw({
  className,
  from
}: {
  className?: string;
  from: "home" | "detail";
}) {
  const userInfoStore = useUserInfoStore();
  const { userInfo } = useAuth();
  const lucyDrawStore = useLuckyDrawStore();
  const { currentRound, isLoading, fetchCurrentRound, participation } =
    useLucyDraw();
  const configStore = useConfigStore();
  const [status, setStatus] = useState(0); // 0: running, 1: drawing, 2: end
  const timerRef = useRef<any>(null);
  const [showBuyTicket, setShowBuyTicket] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [winningList, setWinningList] = useState<any[]>([]);
  const [winningAmount, setWinningAmount] = useState(0);
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
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const { winningList, number } = await fetchCurrentRound();
      if (winningList.length > 0 || number === 0) {
        setStatus(2);
        setWinningList(winningList);

        let amount = Big(0);
        winningList?.forEach((item: any) => {
          if (item.user.toLowerCase() === userInfo?.user?.toLowerCase()) {
            amount = amount.plus(Big(item.volume));
          }
        });

        if (amount.gt(0)) {
          setWinningAmount(amount.toNumber());
        }

        setWinningAmount(amount.toNumber());

        setTimeout(async () => {
          await getUserPrize();
          await fetchCurrentRound();
          setStatus(0);
        }, 3 * 1000);
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
    currentRound,
    participation,
    prizeAmount,
    status,
    tickets,
    winningList,
    setShowBuyTicket,
    userInfoStore,
    fetchResult,
    setStatus,
    className,
    winningAmount,
    onShowDetail: () => setShowDetail(true)
  };

  const historyParams = {
    historyRound: lucyDrawStore.historyRound,
    isLoading,
    fetchCurrentRound,
    prizeAmount,
    currentRound
  };

  return (
    <>
      {from === "home" && <HomeEntry {...params} />}
      {from === "detail" && <BtcDetailEntry {...params} />}
      {lucyDrawStore.showHistory && (
        <LucyDrawHistory
          open={lucyDrawStore.showHistory}
          onClose={() => lucyDrawStore.set({ showHistory: false })}
          {...historyParams}
        />
      )}
      {showBuyTicket && (
        <BuyTicket
          showBuyTicket={showBuyTicket}
          onClose={() => setShowBuyTicket(false)}
        />
      )}
      {showDetail && (
        <DetailModal
          open={showDetail}
          onClose={() => setShowDetail(false)}
          onShowBuyTicket={() => setShowBuyTicket(true)}
          {...params}
          {...historyParams}
        />
      )}
    </>
  );
}
