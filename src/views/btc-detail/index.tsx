import PageBack from "@/views/profile/components/page-back";
import ShareBtn from "./share-btn";
import BasicInfo from "./basic-info";
import Bids from "./bids";
import Traders from "./traders";
import Buy from "./buy";
import YouBought from "./you-bought";
import { useBtcContext } from "../btc/context";
import { useMemo } from "react";
import WinnerInfo from "./winner-info";

export default function BtcDetail({
  disabled,
  balanceNotEnough,
  onBidClick
}: {
  disabled: boolean;
  balanceNotEnough: boolean;
  onBidClick: () => void;
}) {
  const { winnerBidList, pool } = useBtcContext();

  const [totalBids, totalTimes] = useMemo(() => {
    if (!winnerBidList?.length) return [0, 0];
    let _totalBids = 0;

    winnerBidList.forEach((item: any) => {
      _totalBids += item.times;
    });

    return [_totalBids, winnerBidList.length];
  }, [winnerBidList]);

  return (
    <div className="flex flex-col items-center w-full pb-[60px]">
      <div className="flex items-center justify-between w-[1412px] pt-[30px]">
        <PageBack className="bg-[#FFFFFF80] border-[#E4E4E4] !text-[#8A87AA] !relative !top-0 !left-0" />
        <ShareBtn />
      </div>
      <div className="flex gap-[20px] mt-[20px] items-stretch">
        <div className="w-[950px] flex flex-col gap-[20px]">
          <BasicInfo />
          <Bids />
          <Traders />
        </div>
        <div className="w-[442px] flex flex-col">
          {pool?.status === 2 ? (
            <WinnerInfo totalBids={totalBids} totalTimes={totalTimes} />
          ) : (
            <Buy
              disabled={disabled}
              balanceNotEnough={balanceNotEnough}
              onBidClick={onBidClick}
            />
          )}
          <YouBought
            totalBids={totalBids}
            totalTimes={totalTimes}
            winnerBidList={winnerBidList}
          />
        </div>
      </div>
    </div>
  );
}
