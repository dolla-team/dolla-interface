import clsx from "clsx";
// import CannonCoins from "./cannon-coins";
import FlipCoins from "./flip-coins";
import { useBtcContext } from "../context";
import FlippingCoin from "../components/fliping-coin";
import PreLoading from "./pre-loading";
import EndPanel from "../detail/end";
import Cancel from "../detail/cancel";

export default function Grand({ className }: { className?: string }) {
  const { flipStatus, pool, isDetail } = useBtcContext();

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center mx-auto overflow-hidden",
        isDetail && pool?.status === 2
          ? "w-[calc(100vw-220px)]"
          : "w-[calc(100vw-620px)]",
        className
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
    </div>
  );
}
