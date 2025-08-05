import clsx from "clsx";
import FlipCoins from "../flip-coins";
import { useBtcContext } from "../../context";
import FlippingCoin from "../../components/fliping-coin";
import PreLoading from "../pre-loading";
import EndPanel from "../../detail/end";
import Cancel from "../../detail/cancel";
import Points from "@/sections/points";
import LucyDraw from "@/sections/lucy-draw";

export default function GrandMobile({ tokenBalance }: any) {
  const { flipStatus, pool, isDetail } = useBtcContext();

  return (
    <div
      className={clsx("relative", !isDetail ? "overflow-hidden" : "grow")}
      style={{
        height: !isDetail ? window.innerHeight - 444 : "auto"
      }}
    >
      {!isDetail && (
        <>
          <FlipCoins />
          {flipStatus === 3 && <FlippingCoin start={true} />}
          {flipStatus === 1 && <PreLoading />}
        </>
      )}
      {pool?.status === 2 && isDetail && <EndPanel data={pool} />}
      {(pool?.status === 3 || pool?.status === 5) && isDetail && (
        <Cancel data={pool} />
      )}
      {flipStatus === 0 && (
        <>
          <Points
            className={pool?.status === 1 ? "bottom-[260px]" : "!bottom-[30px]"}
          />
          <LucyDraw
            tokenBalance={tokenBalance}
            className={pool?.status === 1 ? "bottom-[260px]" : "!bottom-[30px]"}
          />
        </>
      )}
    </div>
  );
}
