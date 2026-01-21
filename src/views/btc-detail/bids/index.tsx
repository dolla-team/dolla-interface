import { useBtcContext } from "@/views/btc/context";
import FillLevel from "./fill-level";
import SizeDistribution from "./size-distribution";
import TotalBids from "./total-bids";
import { useMemo } from "react";

export default function Bids() {
  const { pool, winnerBidList } = useBtcContext();

  const [bidsDistribution, bidsProgress, winnerBidsTime] = useMemo(() => {
    if (!winnerBidList?.length) return [{}, [], []];
    let _bidsDistribution: any = {};
    let _bidsProgress: any = [];
    let _winnerBidsTime: any = [];
    const startTime = new Date(pool.created_at).getTime();
    const endTime = new Date(pool.result_time).getTime();

    winnerBidList.forEach((item: any) => {
      _bidsDistribution[item.times] = (_bidsDistribution[item.times] || 0) + 1;
      const bidTime = new Date(item.created_at).getTime();
      _bidsProgress.push((bidTime - startTime) / (endTime - startTime));
      _winnerBidsTime.push(item.time);
    });

    _bidsProgress.sort((a: number, b: number) => a - b);
    _winnerBidsTime.sort((a: number, b: number) => a - b);
    return [_bidsDistribution, _bidsProgress, _winnerBidsTime];
  }, [winnerBidList, pool]);

  return (
    <div className="w-full h-[290px] bg-white border border-[#E4E4E4] rounded-[20px] px-[30px] flex items-center">
      <div>
        <FillLevel
          data={pool}
          winnerBidsProgress={bidsProgress}
          winnerBidList={winnerBidList}
        />
        <SizeDistribution data={pool} winnerDistribution={bidsDistribution} />
      </div>

      <div className="w-[1px] h-[218px] bg-[#E4E4E4] mx-[30px]" />
      <div>
        <TotalBids
          data={pool}
          winnerBidsTime={winnerBidsTime}
          winnerBidList={winnerBidList || []}
        />
      </div>
    </div>
  );
}
