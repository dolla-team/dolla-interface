import Loading from "@/components/icons/loading";
import LoadingMore from "@/components/loading/loading-more";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";
import Empty from "./empty";
import useRecords from "@/hooks/transaction/use-records";
import { formatNumber } from "@/utils/format/number";
import { useMemo } from "react";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";

export default function Txs() {
  const { loading, records, hasMore, loadMore } = useRecords();

  const { containerRef, isLoading } = useInfiniteScroll(loadMore, {
    loading,
    hasMore,
    threshold: 100
  });

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      {records.map((item) => (
        <Item key={item.id} data={item} />
      ))}
      {records.length === 0 && !loading && <Empty text="No transactions" />}
      {loading && records.length === 0 && (
        <div className="text-[14px] text-[#5E6B7D] w-full h-[100px] flex items-center justify-center">
          <Loading size={20} />
        </div>
      )}
      {records.length > 0 && (
        <LoadingMore loading={isLoading} hasMore={hasMore} className="w-full" />
      )}
    </div>
  );
}

const Item = ({ data }: { data: any }) => {
  return (
    data && (
      <div className="flex justify-between items-center py-[8px]">
        <div className="flex items-center gap-[8px]">
          <div className="relative flex">
            {data.token?.icon && (
              <img
                src={data.token.icon}
                className="w-[32px] h-[32px] rounded-full object-cover"
              />
            )}
            {/* <img
            src={config.purchaseToken.icon}
            className="w-[32px] h-[32px] rounded-full object-cover ml-[-10px]"
          /> */}
          </div>
          <div>
            <div className="text-[14px] text-black">{data?.business_type}</div>
            <div className="text-[10px] text-[#8A87AA]">
              {data.token?.symbol}
            </div>
          </div>
        </div>
        <div>
          <div className="text-[14px] text-black">
            {formatNumber(
              data.amount,
              3,
              true,
              data.type === "deposit" ? { prefix: "+ " } : { prefix: "- " }
            )}{" "}
            {data.token?.symbol}
          </div>
          {/* <div className="text-[10px] text-[#8A87AA]">-200 USDC</div> */}
        </div>
      </div>
    )
  );
};
