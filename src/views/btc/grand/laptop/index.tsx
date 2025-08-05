import clsx from "clsx";
// import CannonCoins from "./cannon-coins";
import FlipCoins from "../flip-coins";
import { useBtcContext } from "../../context";
import FlippingCoin from "../../components/fliping-coin";
import PreLoading from "../pre-loading";
import EndPanel from "../../detail/end";
import Cancel from "../../detail/cancel";

export default function Grand({ className }: { className?: string }) {
  const { flipStatus, pool, isDetail } = useBtcContext();

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center mx-auto overflow-hidde h-[calc(100vh-416px)] pt-[25px]",
        isDetail && pool?.status === 2
          ? "w-[calc(100vw-220px)]"
          : "w-[calc(100vw-620px)]",
        className
      )}
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
    </div>
  );
}
