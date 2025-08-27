import EndPanel from "../../detail/end";
import Cancel from "../../detail/cancel";
import { useNftContext } from "../../context";
import clsx from "clsx";
import Carousel from "./carousel";
import Winner from "../../components/result/winner";
import MarketInfo from "../../components/market-info";

export default function Laptop() {
  const { flipStatus, pool, bidResult } = useNftContext();
  return (
    <div
      className={clsx(
        "relative flex items-center justify-center mx-auto overflow-hidde h-[calc(100vh-350px)]",
        pool?.status === 1 ? "pb-[10px]" : "pb-[100px] pt-[25px]",
        !(pool?.status === 1 || flipStatus !== 0)
          ? "w-[calc(100vw-220px)]"
          : "w-[calc(100vw-620px)]"
      )}
    >
      {(pool?.status === 1 || flipStatus !== 0) && (
        <div>
          <MarketInfo />
          <Carousel />
          <div className="w-[calc(50%-300px)] h-[100vh] pointer-events-none fixed left-0 top-0 bg-linear-to-r from-[#000000] to-[#00000000]" />
          <div className="w-[calc(50%-300px)] h-[100vh] pointer-events-none fixed right-0 top-0 bg-linear-to-l from-[#000000] to-[#00000000]" />
        </div>
      )}
      {pool?.status === 2 && flipStatus === 0 && <EndPanel data={pool} />}
      {(pool?.status === 3 || pool?.status === 5) && flipStatus === 0 && (
        <Cancel data={pool} />
      )}
      {bidResult?.isWinner && <Winner />}
    </div>
  );
}
