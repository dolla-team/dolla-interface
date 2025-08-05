import { useBtcContext } from "../../context";
import { useEffect, useMemo, useRef, useState } from "react";
import Result from "../../components/result";
import { useDollaEyeContext } from "@/contexts/dolla-eye";
import { EEyeType, EyeTypeMap } from "@/hooks/use-dolla-eye";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
import Coins from "./coins";

export default function FlipCoins() {
  const {
    bids,
    flipStatus,
    pool,
    coinsRef,
    flipComplete,
    bidResult,
    setFlipStatus,
    onReset
  } = useBtcContext();
  const isMobile = useIsMobile();

  const SIZE: Record<number, number> = isMobile
    ? {
        1: 212,
        10: 80,
        50: 60,
        100: 60
      }
    : {
        1: 212,
        5: 140,
        10: 130,
        50: 62,
        100: 62
      };
  const { setCurrentEye } = useDollaEyeContext();

  const coinContainerRef = useRef<any>(null);
  const contentRef = useRef<any>(null);
  const [shouldCenter, setShouldCenter] = useState(false);

  const [points, tickets, sumPoints, sumTickets, isWinner] = useMemo(() => {
    if (!bidResult) {
      return [[], [], 0, 0, false];
    }
    const _p = bidResult.point
      ? bidResult.point.wild_coin_ev_result.split(",")
      : [];
    const _t = bidResult.ticket ? bidResult.ticket?.result?.split(",") : [];
    const _pt = _p.reduce((acc: number, curr: string) => acc + Number(curr), 0);
    const _tt = _t.reduce(
      (acc: number, curr: string) => acc + Number(curr === "0" ? 1 : 0),
      0
    );

    return [_p, _t, _pt, _tt, bidResult.bid.is_winner];
  }, [bidResult]);

  useEffect(() => {
    // Handle eye type

    if (sumTickets === 1 && sumPoints === 0) {
      setCurrentEye(EyeTypeMap[EEyeType.PrizeTicket]);
    } else if (bidResult?.bid?.is_winner) {
      setCurrentEye(EyeTypeMap[EEyeType.PrizeBTC]);
    } else if (sumTickets === 0 && sumPoints > 0 && sumPoints < 1000) {
      setCurrentEye(EyeTypeMap[EEyeType.PrizeLowPTS]);
    } else if (sumTickets > 0 && sumPoints > 0) {
      setCurrentEye(EyeTypeMap[EEyeType.PrizeBoth]);
    } else if (flipStatus > 0) {
      const eyeType = `Bidding${bids}` as keyof typeof EEyeType;
      setCurrentEye(EyeTypeMap[EEyeType[eyeType]]);
    } else {
      setCurrentEye(EyeTypeMap[EEyeType.Normal]);
    }
  }, [flipStatus, sumPoints, sumTickets]);

  useEffect(() => {
    const checkHeightAndCenter = () => {
      if (contentRef.current && coinContainerRef.current) {
        const contentHeight = contentRef.current.offsetHeight;
        const containerHeight = coinContainerRef.current.offsetHeight;

        setShouldCenter(contentHeight < containerHeight);
      }
    };

    checkHeightAndCenter();

    const resizeObserver = new ResizeObserver(checkHeightAndCenter);

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    if (coinContainerRef.current) {
      resizeObserver.observe(coinContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [bids, flipStatus, pool]);

  return (
    pool && (
      <div
        className="w-full overflow-y-auto overflow-x-hidden h-full flex justify-center"
        style={{
          maxWidth: isMobile
            ? "100%"
            : (SIZE[bids] + 20) * (bids > 10 ? 11 : 6),
          alignItems: shouldCenter ? "center" : "flex-start"
        }}
        ref={coinContainerRef}
      >
        <div
          ref={contentRef}
          className={clsx(
            "flex items-center",
            "max-md:py-[10px] md:flex-wrap md:gap-[10px_30px] md:justify-center",
            isMobile && bids > 10 && "flex-col"
          )}
        >
          <Coins
            bids={bids}
            pool={pool}
            points={points}
            tickets={tickets}
            flipStatus={flipStatus}
            isWinner={isWinner}
            flipComplete={flipComplete}
            coinContainerRef={coinContainerRef}
            setFlipStatus={setFlipStatus}
            coinsRef={coinsRef}
            SIZE={SIZE}
          />
        </div>

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
