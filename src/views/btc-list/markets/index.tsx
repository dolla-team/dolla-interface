import Tabs from "@/components/tabs";
import { useState } from "react";
import columns from "./columns";
import SortIcon from "./sort-icon";
import Market from "./market";
import usePoolList from "@/hooks/use-pool-list";
import Loading from "@/components/icons/loading";

export default function Markets() {
  const [tab, setTab] = useState(0);
  const [sortDataIndex, setSortDataIndex] = useState("");
  const [sortDirection, setSortDirection] = useState(false);
  const {
    poolList,
    loading
    // sortField,
    // sortOrder,
    // setSortField,
    // setSortOrder,
    // collection,
    // setCollection
  } = usePoolList({
    pageLimit: 100,
    chain: "solana",
    tokenStatus: 1
  });

  return (
    <div className="w-full bg-white mt-[30px] rounded-[16px] border border-[#F2F2F233] px-[30px] py-[20px]">
      <div className="flex items-center gap-[18px]">
        <div className="text-[20px] text-black font-[700] mb-[10px]">
          Markets
        </div>
        <Tabs
          tabs={[
            { label: "All", key: 0 },
            { label: "BTC", key: 1 },
            { label: "NFT", key: 2 }
          ]}
          currentTab={tab}
          onChangeTab={(tab: any) => {
            setTab(tab);
          }}
          className="w-[202px] h-[32px] p-[3px] border border-[#E4E4E4] bg-[#F2F2F299] rounded-[16px] backdrop-blur-[25px] !gap-0"
          tabClassName="text-[14px] w-1/3 text-center !text-[#000] h-[26px] leading-[26px]"
          activeClassName="!text-white"
          cursorClassName="!bg-[#6F37FF] h-[26px] rounded-[12px] w-full !bottom-[0px]"
        />
      </div>
      <div className="flex items-center text-[#8A87AA] text-[12px] mt-[20px] pl-[14px] pr-[20px]">
        {columns.map((column: any) => (
          <div
            key={column.title}
            className="flex items-center gap-[4px]"
            style={{ width: column.width }}
          >
            <span>{column.title}</span>
            {column.sort && (
              <SortIcon
                active={sortDataIndex === column.dataIndex}
                expanded={sortDataIndex === column.dataIndex && sortDirection}
                onClick={() => {
                  setSortDataIndex(column.dataIndex);
                  setSortDirection(!sortDirection);
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-[20px] flex flex-col gap-[10px]">
        {poolList.map((item: any) => (
          <Market key={item.id} data={item} />
        ))}
        {loading && (
          <div className="flex justify-center items-center min-h-[150px]">
            <Loading size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
