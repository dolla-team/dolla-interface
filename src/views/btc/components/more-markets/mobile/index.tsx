import { useBtcContext } from "@/views/btc/context";
import { MarketFilters, MarketSizes } from "../config";
import clsx from "clsx";
import usePoolList from "@/hooks/use-pool-list";
import Market from "../market";
import MarketLoading from "../market-loading";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";

const Markets = (props: any) => {
  const { } = props;

  const { onMobileMarketsClose, setSelectedMarket, pool: selectedMarket } = useBtcContext();
  const {
    poolList,
    loading,
    onQueryPoolList,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    hasMore,
    pageRef,
    volume,
    setVolume,
    LIMIT
  } = usePoolList({
    pageLimit: 10,
    isScrollList: true,
    onFirstPageLoad: (_poolList) => {
      setSelectedMarket(_poolList[0]);
    }
  });

  return (
    <div className="relative w-full h-screen bg-[#1A191D] text-[14px] leading-[100%] font-[400] font-[SpaceGrotesk]">
      <div className="fixed bg-[#1A191D] left-0 top-0 z-[22] w-full pt-[10px] shadow-[0px_16px_32px_0px_#1A191D]">
        <div className="relative w-full flex justify-center items-center gap-[10px] px-[13px]">
          <button
            type="button"
            className="absolute left-[13px] top-[0px] shrink-0 w-[32px] h-[32px] flex justify-center items-center border border-[#3B3951] bg-white/10 rounded-[8px]"
            onClick={onMobileMarketsClose}
          >
            <img src="/icon-back.svg" alt="back" className="w-[11px] h-[17px]" />
          </button>
          <div className="font-[DelaGothicOne] text-[26px] leading-[100%] font-[400] bg-clip-text text-transparent bg-[linear-gradient(270deg,_#FFC42F_0%,_#FFF698_100%)]">
            Markets
          </div>
          <div className=""></div>
        </div>
        <div className="w-full p-[17px_14px_0]">
          <div className="flex items-center flex-nowrap gap-[10px]">
            <div className="shrink-0 text-[#ADBCCF] text-[12px] w-[70px]">Market Size</div>
            <div className="flex items-center gap-[8px] flex-1 w-0 overflow-x-auto pr-[10px]">
              {MarketSizes.map((item: { label: string; key: number }) => (
                <button
                  key={item.key}
                  className={clsx(
                    "button h-[30px] px-[10px] shrink-0 whitespace-nowrap border border-[#383F47] rounded-[6px] flex justify-center items-center text-[12px]",
                    volume === item.key
                      ? "bg-[#454C56] text-white"
                      : "text-[#ADBCCF] bg-[#1A1E24]"
                  )}
                  onClick={() => setVolume(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center flex-nowrap gap-[10px] mt-[12px]">
            <div className="shrink-0 text-[#ADBCCF] text-[12px] w-[70px]">Filter by</div>
            <div className="flex items-center gap-[8px] flex-1 w-0 overflow-x-auto pr-[10px]">
              {MarketFilters.map((item) => (
                <button
                  key={item.key}
                  className={clsx(
                    "button h-[30px] px-[10px] shrink-0 whitespace-nowrap border border-[#383F47] rounded-[6px] flex justify-center items-center text-[12px]",
                    sortField === item.key
                      ? "bg-[#454C56] text-white"
                      : "text-[#ADBCCF] bg-[#1A1E24]"
                  )}
                  onClick={() => setSortField(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <InfiniteScrollContainer
        onLoadMore={() => {
          // next page
          onQueryPoolList(1);
        }}
        loading={loading}
        hasMore={hasMore}
        className="pt-[150px] w-full h-full flex flex-col items-center gap-[12px] pb-[70px] overflow-y-auto"
        threshold={50}
      >
        {poolList.map((item: any) => (
          <Market
            key={item.id}
            data={item}
            onClick={() => {
              setSelectedMarket(item);
              onMobileMarketsClose();
            }}
            isForceNormal
            isActive={item.id === selectedMarket?.id}
          />
        ))}
        {(loading && !poolList.length) && (
          <>
            {Array.from({ length: LIMIT }).map((_, index) => (
              <MarketLoading key={index} />
            ))}
          </>
        )}
        {!loading && poolList.length === 0 && (
          <div className="text-center text-[#ADBCCF] leading-[168px]">
            No data
          </div>
        )}
      </InfiniteScrollContainer>
    </div>
  );
};

export default Markets;
