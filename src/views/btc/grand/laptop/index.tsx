import clsx from "clsx";
// import CannonCoins from "./cannon-coins";
import FlipCoins from "../flip-coins";
import { useBtcContext } from "../../context";
import FlippingCoin from "../../components/fliping-coin";
import PreLoading from "../pre-loading";
import EndPanel from "../../detail/end";
import Cancel from "../../detail/cancel";

export default function Grand({
  className,
  ...restProps
}: {
  className?: string;
  restProps: any;
}) {
  const { flipStatus, pool } = useBtcContext();

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center mx-auto overflow-hidde h-[calc(100vh-416px)] pt-[25px] xl:scale-none scale-[0.75]",
        !(pool?.status === 1 || flipStatus !== 0)
          ? "w-[calc(100vw-220px)] z-[20]"
          : "w-[calc(100vw-620px)]",
        className
      )}
    >
      {(pool?.status === 1 || flipStatus !== 0) && (
        <>
          <FlipCoins {...restProps} />
          {flipStatus === 3 && <FlippingCoin start={true} />}
          {flipStatus === 1 && <PreLoading />}
        </>
      )}
      {pool?.status === 2 && flipStatus === 0 && <EndPanel data={pool} />}
      {(pool?.status === 3 || pool?.status === 5) && flipStatus === 0 && (
        <Cancel data={pool} />
      )}
    </div>
  );
}
