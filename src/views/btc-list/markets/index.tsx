import { liveColumns, soldColumns } from "./columns";
import SortIcon from "./sort-icon";
import Market from "./market";
import usePoolList from "@/hooks/use-pool-list";
import Loading from "@/components/icons/loading";
import { useNavigate } from "@/libs/router";
import clsx from "clsx";
import { BASE_TOKEN, AMOUNT } from "@/config/btc";
import useTaskStore from "@/stores/use-task";
import Empty from "@/sections/wallet/panels/info/empty";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import { useAllMarketsStore } from "@/stores/use-all-markets";
import Pagination from "@/components/pagination";
import Button from "@/components/button";
import { BTC_CREATE_FORM_URL } from "@/config";
import { useAuth } from "@/contexts/auth";
import { useMemo } from "react";

export default function Markets() {
  const navigate = useNavigate();
  const taskStore = useTaskStore();
  const { isCreatedWhitelist } = useAuth();
  const allMarketsStore = useAllMarketsStore();
  const {
    poolList,
    pools,
    loading,
    sortField,
    sortOrder,
    pageRef,
    hasMore,
    onNextPage,
    setSortField,
    setSortOrder
  } = usePoolList({
    tokenStatus: 0,
    type: allMarketsStore.tab
  });

  const columns = useMemo(() => {
    return allMarketsStore.status === "1" ? liveColumns : soldColumns;
  }, [allMarketsStore.status]);

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
        <div className="flex items-center gap-[10px]">
          <div className="text-[20px] text-black font-[700] mb-[10px]">
            All Markets
          </div>
          <div className="flex items-center h-[40px] p-[2px] bg-[#0000000D] border border-[#F2F2F233] rounded-[10px]">
            {[
              { label: "All", key: "all" },
              {
                label: "BTC",
                key: "btc"
              },
              {
                label: "NFTs",
                key: "nfts",
                disabled: true
              },
              {
                label: "RWAs",
                key: "rwas",
                disabled: true
              },
              {
                label: "Gold",
                key: "gold",
                disabled: true
              }
            ].map((item) => (
              <button
                key={item.key}
                className={clsx(
                  "min-w-[50px] text-center h-[34px] rounded-[8px] text-[12px] px-[10px]",
                  allMarketsStore.tab === item.key && "bg-[#FFC42F]",
                  item.disabled ? "text-[#8A87AA]" : "text-black button"
                )}
                onClick={() => {
                  if (item.disabled) return;
                  allMarketsStore.set({
                    tab: item.key
                  });
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-[14px]">
          <div className="flex items-center h-[40px] p-[2px] bg-[#0000000D] border border-[#F2F2F233] rounded-[10px]">
            {[
              { label: "Live", key: "1" },
              {
                label: "Ended",
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
          {isCreatedWhitelist ? (
            <Button
              onClick={() => {
                navigate("/btc/create");
              }}
              className="w-[86px] h-[38px] !bg-[#1C1C23] !text-white !rounded-[10px]"
            >
              + Create
            </Button>
          ) : (
            <CreateButton />
          )}
        </div>
      </div>
      <div className="flex items-center text-[#8A87AA] text-[12px] mt-[20px] pl-[14px] pr-[20px]">
        {columns.map((column: any) => (
          <div
            key={column.title}
            className={clsx(
              "flex items-center gap-[4px] ",
              column.sort && "cursor-pointer",
              column.align === "center" && "justify-center",
              column.align === "right" && "justify-end"
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
          poolList
            .filter((item: any) => pools[item])
            .map((item: any) => (
              <Market
                key={item}
                data={pools[item]}
                onClick={() => {
                  navigate(`/btc/${item}`);
                }}
              />
            ))
        )}
      </div>
      <div className="flex justify-end items-center pt-[10px]">
        <Pagination
          current={pageRef.current + 1}
          hasNextPage={hasMore}
          onNext={() => {
            onNextPage(1);
          }}
          onPrev={() => {
            console.log("prev");
            onNextPage(-1);
          }}
        />
      </div>
    </div>
  );
}

const CreateButton = () => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Top}
      content={
        <div className="w-[168px] text-[#5E6B7D] text-[12px] p-[10px] bg-white rounded-[10px] border border-[#E4E4E4]">
          <div>You need to apply before using Create.</div>
          <Button
            onClick={() => {
              window.open(BTC_CREATE_FORM_URL, "_blank");
            }}
            className="w-full h-[26px] !bg-[#FFC42F] !text-black !rounded-[6px] text-[12px] mt-[10px]"
          >
            Apply
          </Button>
        </div>
      }
    >
      <Button
        disabled
        className="w-[86px] h-[38px] !bg-[#1C1C23] !text-white !rounded-[10px]"
      >
        + Create
      </Button>
    </Popover>
  );
};

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
