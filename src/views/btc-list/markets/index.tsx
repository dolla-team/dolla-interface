import columns from "./columns";
import SortIcon from "./sort-icon";
import Market from "./market";
import usePoolList from "@/hooks/use-pool-list";
import Loading from "@/components/icons/loading";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { BASE_TOKEN, AMOUNT } from "@/config/btc";
import useTaskStore from "@/stores/use-task";
import Empty from "@/sections/wallet/panels/info/empty";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import { useAllMarketsStore } from "@/stores/use-all-markets";

export default function Markets() {
  const navigate = useNavigate();
  const taskStore = useTaskStore();
  const allMarketsStore = useAllMarketsStore();
  const {
    poolList,
    loading,
    sortField,
    sortOrder,
    setSortField,
    setSortOrder
  } = usePoolList({
    pageLimit: 100,
    tokenStatus: 0,
    volume: allMarketsStore.tab
  });

  return (
    <div
      className={clsx(
        "w-full bg-white mt-[30px] rounded-[16px] border px-[30px] py-[20px]",
        taskStore.isBid
          ? "border-[#FFC42F]/30 shadow-[0_0_20px_20px_rgba(255,196,47,0.5)]"
          : " border-[#F2F2F233]"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="text-[20px] text-black font-[700] mb-[10px]">
          All Markets
        </div>
        <div className="flex items-center gap-[14px]">
          <div className="flex items-center h-[40px] p-[2px] bg-[#0000000D] border border-[#F2F2F233] rounded-[10px]">
            {[
              { label: "All", key: 0 },
              {
                label: AMOUNT[0] + " " + BASE_TOKEN.symbol,
                key: AMOUNT[0] * 10 ** BASE_TOKEN.decimals
              },
              {
                label: AMOUNT[1] + " " + BASE_TOKEN.symbol,
                key: AMOUNT[1] * 10 ** BASE_TOKEN.decimals
              },
              {
                label: AMOUNT[2] + " " + BASE_TOKEN.symbol,
                key: AMOUNT[2] * 10 ** BASE_TOKEN.decimals
              }
            ].map((item) => (
              <button
                key={item.key}
                className={clsx(
                  "button min-w-[50px] text-center h-[34px] rounded-[8px] text-[12px] px-[10px]",
                  allMarketsStore.tab === item.key
                    ? "bg-[#FFC42F] text-black"
                    : "text-[#8A87AA]"
                )}
                onClick={() => {
                  allMarketsStore.set({
                    tab: item.key
                  });
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center h-[40px] p-[2px] bg-[#0000000D] border border-[#F2F2F233] rounded-[10px]">
            {[
              { label: "Live", key: "1" },
              {
                label: "Sold",
                key: "2"
              }
            ].map((item) => (
              <button
                key={item.key}
                className={clsx(
                  "button min-w-[50px] text-center h-[34px] rounded-[8px] text-[12px] px-[10px]",
                  allMarketsStore.status === item.key
                    ? "bg-[#FFC42F] text-black"
                    : "text-[#8A87AA]"
                )}
                onClick={() => {
                  allMarketsStore.set({
                    status: item.key
                  });
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center text-[#8A87AA] text-[12px] mt-[20px] pl-[14px] pr-[20px]">
        {columns.map((column: any) => (
          <div
            key={column.title}
            className={clsx(
              "flex items-center gap-[4px] ",
              column.sort && "cursor-pointer",
              column.align === "center" && "justify-center"
            )}
            style={{ width: column.width }}
            onClick={() => {
              if (column.sort) {
                setSortField(column.dataIndex);
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }
            }}
          >
            <span>{column.title}</span>
            {column.dataIndex === "anchor_price" && <MarketInfo />}
            {column.sort && (
              <SortIcon
                active={sortField === column.dataIndex}
                expanded={sortField === column.dataIndex && sortOrder === "asc"}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-[20px] flex flex-col gap-[10px]">
        {loading ? (
          <div className="flex justify-center items-center min-h-[150px]">
            <Loading size={20} />
          </div>
        ) : poolList.length === 0 ? (
          <Empty className="!py-[50px]" text="No Data" />
        ) : (
          poolList.map((item: any) => (
            <Market
              key={item.id}
              data={item}
              onClick={() => {
                navigate(`/btc/detail/${item.pool_id}`);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

const MarketInfo = () => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Bottom}
      content={
        <div className="w-[360px] text-[#3B3951] text-[12px] p-[14px] bg-white rounded-[10px] border border-[#E4E4E4]">
          <div className="opacity-80 leading-[120%]">
            <div className="font-[500] text-black">Anchor Value: </div>
            <div className="mt-[4px] font-[400]">
              Base reference for calculating win probability.
            </div>
            <div>Win per $1 = 1 / (Price of asset at listing × 1.2).</div>
          </div>
        </div>
      }
    >
      <button className="relative transition-opacity button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          className="mt-[4px]"
        >
          <path
            d="M8 0C12.4615 5.7067e-07 16 3.6154 16 8C16 12.3846 12.4615 16 8 16C3.6154 16 1.05567e-05 12.4615 0 8C0 3.53847 3.53847 0 8 0ZM8 1.53809C4.46155 1.53809 1.53809 4.46155 1.53809 8C1.5381 11.5384 4.38463 14.4619 8 14.4619C11.6154 14.4619 14.4619 11.5384 14.4619 8C14.4619 4.46155 11.5385 1.53809 8 1.53809ZM8.76953 12.6152H7.23047V6H8.76953V12.6152ZM8.76953 4.69238H7.23047V3.23047H8.76953V4.69238Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </Popover>
  );
};
