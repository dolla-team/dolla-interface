import clsx from "clsx";
import FlipCoins from "../flip-coins";
import { useBtcContext } from "../../context";
import FlippingCoin from "../../components/fliping-coin";
import PreLoading from "../pre-loading";
import EndPanel from "../../detail/end";
import Cancel from "../../detail/cancel";
import Points from "@/sections/points";
import LucyDraw from "@/sections/lucy-draw";

export default function GrandMobile({ tokenBalance, update }: any) {
  const { flipStatus, pool } = useBtcContext();
  return (
    <div
      className={clsx(
        "relative grow",
        pool?.status === 1 && "overflow-hidden h-[calc(100vh-444px)]"
      )}
    >
      {pool?.status === 1 && (
        <>
          <FlipCoins />
          {flipStatus === 3 && <FlippingCoin start={true} />}
          {flipStatus === 1 && <PreLoading />}
        </>
      )}
      {pool?.status === 2 && <EndPanel data={pool} />}
      {pool?.status === 3 && <Cancel data={pool} />}
      {flipStatus === 0 && (
        <>
          <Points
            className={pool?.status === 1 ? "bottom-[260px]" : "!bottom-[30px]"}
          />
          <LucyDraw
            update={update}
            tokenBalance={tokenBalance}
            className={pool?.status === 1 ? "bottom-[260px]" : "!bottom-[30px]"}
          />
        </>
      )}
    </div>
  );
}
