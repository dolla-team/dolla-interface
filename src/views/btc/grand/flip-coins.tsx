import { useBtcContext } from "../context";
import FlipCoin from "./flip-coin";
import { useMemo, useRef } from "react";
import Result from "../components/result";

const SIZE: Record<number, number> = {
  1: 212,
  5: 140,
  10: 130,
  50: 62,
  100: 62
};

export default function FlipCoins() {
  const {
    bids,
    flipStatus,
    pool,
    coinsRef,
    flipComplete,
    bidResult,
    setFlipStatus,
    onReset,
    getPoolRecommend
  } = useBtcContext();

  const coinContainerRef = useRef<any>(null);

  const [points, tickets, sumPoints, sumTickets, isWinner] = useMemo(() => {
    if (!bidResult) {
      return [[], [], 0, 0, false];
    }
    const _p = bidResult.point
      ? bidResult.point.wild_coin_ev_result.split(",")
      : [];
    const _t = bidResult.ticket ? bidResult.ticket?.result?.split(",") : [];

    if (bidResult.bid.is_winner) {
      getPoolRecommend();
    }

    return [
      _p,
      _t,
      _p.reduce((acc: number, curr: string) => acc + Number(curr), 0),
      _t.reduce(
        (acc: number, curr: string) => acc + Number(curr === "0" ? 1 : 0),
        0
      ),
      bidResult.bid.is_winner
    ];
  }, [bidResult]);

  return (
    pool && (
      <div
        className="flex items-center justify-center w-full gap-[10px_30px] flex-wrap overflow-y-auto overflow-x-hidden h-full"
        style={{
          maxWidth: (SIZE[bids] + 20) * (bids > 10 ? 11 : 6)
        }}
        ref={coinContainerRef}
      >
        {new Array(bids).fill(0).map((_, index) => (
          <FlipCoin
            key={pool.id + "_" + index + "_" + bids}
            size={SIZE[bids]}
            points={points[index] || 0}
            ticket={tickets[index] || 0}
            disabled={flipStatus !== 4 && flipStatus !== 5}
            bids={bids}
            index={index}
            ref={(el) => {
              coinsRef.current[index] = el;
            }}
            onFlipComplete={flipComplete}
            coinContainerRef={coinContainerRef}
            setFlipStatus={setFlipStatus}
          />
        ))}

        {flipStatus === 6 && (
          <Result
            points={sumPoints}
            tickets={sumTickets}
            onClose={() => {
              setFlipStatus(0);
              onReset();
            }}
            isWinner={isWinner}
          />
        )}
      </div>
    )
  );
}
