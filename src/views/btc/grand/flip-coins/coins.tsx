import { useMemo } from "react";
import FlipCoin from "../flip-coin";
import clsx from "clsx";
import useIsMobile from "@/hooks/use-is-mobile";

export function LaptopCoins({
  bids,
  pool,
  points,
  tickets,
  flipStatus,
  isWinner,
  flipComplete,
  coinContainerRef,
  setFlipStatus,
  coinsRef,
  SIZE
}: any) {
  return Array.from({ length: bids }).map((_, index) => (
    <FlipCoin
      key={pool.id + "_" + index + "_" + bids}
      size={SIZE[bids]}
      points={points[index] || 0}
      ticket={tickets[index] || 0}
      disabled={flipStatus !== 4 && flipStatus !== 5 && flipStatus !== 5.5}
      bids={bids}
      index={index}
      ref={(el) => {
        coinsRef.current[index] = el;
      }}
      onFlipComplete={flipComplete}
      coinContainerRef={coinContainerRef}
      setFlipStatus={setFlipStatus}
      isWinner={isWinner}
      flipStatus={flipStatus}
    />
  ));
}

export function MobileCoins({
  bids,
  pool,
  points,
  tickets,
  flipStatus,
  isWinner,
  flipComplete,
  coinContainerRef,
  setFlipStatus,
  coinsRef,
  SIZE
}: any) {
  const columns = useMemo(() => {
    if (bids === 10)
      return [
        new Array(2).fill(0),
        new Array(3).fill(0),
        new Array(3).fill(0),
        new Array(2).fill(0)
      ];
    if (bids === 50 || bids === 100) {
      const len = Math.ceil(bids / 5);
      return new Array(len).fill(new Array(5).fill(0));
    }
    return [new Array(bids).fill(0)];
  }, [bids]);

  return columns?.map((column, colI) => (
    <div
      className={clsx(
        "flex",
        bids === 10 && "flex-col gap-[20px]",
        (bids === 50 || bids === 100) &&
          "gap-[10px] mb-[10px] w-full px-[12px] max-w-[390px]",
        (bids === 50 || bids === 100) &&
          (colI % 2 === 0 ? "pr-[4vw] pl-0" : "pl-[4vw] pr-0")
      )}
      key={colI}
    >
      {column.map((_: any, i: number) => {
        let index =
          bids === 10 ? colI * 3 + i : colI * (column.length || 0) + i;

        if (bids === 10 && colI > 0) {
          index--;
        }

        return (
          <FlipCoin
            key={pool.id + "_" + index + "_" + bids}
            size={SIZE[bids]}
            points={points[index] || 0}
            ticket={tickets[index] || 0}
            disabled={
              flipStatus !== 4 && flipStatus !== 5 && flipStatus !== 5.5
            }
            bids={bids}
            index={index}
            ref={(el) => {
              coinsRef.current[index] = el;
            }}
            onFlipComplete={flipComplete}
            coinContainerRef={coinContainerRef}
            setFlipStatus={setFlipStatus}
            isWinner={isWinner}
          />
        );
      })}
    </div>
  ));
}

export default function Coins(props: any) {
  const isMobile = useIsMobile();
  return isMobile ? <MobileCoins {...props} /> : <LaptopCoins {...props} />;
}
