import BidBtn from "./bid-btn";
import Tabs from "@/components/tabs";
import Bg from "./bg";
import MarketSize from "./market-size";

export default function MobileBidSelection({
  bids,
  flipStatus,
  disabled,
  onChangeBids,
  onBidClick,
  pool
}: {
  bids: number;
  flipStatus: number;
  disabled: boolean;
  onChangeBids: (bids: number) => void;
  onBidClick: () => void;
  pool: any;
}) {
  return (
    (pool?.status === 0 || pool?.status === 1) && (
      <div className="w-full h-[242px] relative shrink-0">
        <Bg className="absolute top-0 left-0 w-full h-[242px]" />
        <MarketSize />
        <div className="relative z-[2] w-[calc(100%-24px)] pb-[24px] ml-[12px] mt-[20px]">
          {flipStatus !== 4 && (
            <BidBtn disabled={disabled} onClick={onBidClick} />
          )}

          <div className="h-[38px] w-full mt-[10px] bg-[#FFFFFF1A] rounded-[12px] border border-[#3B3951] backdrop-blur-[25px] p-[4px] flex items-center">
            <Tabs
              tabs={[
                { label: "$1", key: 1 },
                { label: "$10", key: 10 },
                { label: "$50", key: 50 },
                { label: "$100", key: 100 }
              ]}
              currentTab={bids}
              onChangeTab={(key: number) => {
                onChangeBids(key);
              }}
              className="w-full !gap-0"
              tabClassName="!w-1/4 h-[30px] text-[14px] font-[DelaGothicOne] text-center !pb-0 leading-[30px]"
              activeClassName="!text-[#3E2B2B]"
              cursorClassName="!w-full h-full !rounded-[10px] !bg-linear-to-b !from-[#FFF698] !to-[#FFC42F]"
            />
          </div>
        </div>
      </div>
    )
  );
}
