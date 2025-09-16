import { useState } from "react";
import columns from "./columns";
import SortIcon from "./sort-icon";
import Market from "./market";
import usePoolList from "@/hooks/use-pool-list";
import Loading from "@/components/icons/loading";

export default function Markets() {
  const [sortDataIndex, setSortDataIndex] = useState("");
  const [sortDirection, setSortDirection] = useState(false);
  const {
    poolList: originalPoolList,
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

  // Mock data for poolList
  const mockPoolList = [
    {
      pool_id: "001",
      nft_ids: null,
      reward_token_info: [
        {
          name: "BTC",
          token_id: "1",
          icon: "/btc.png",
          decimals: 8
        }
      ],
      value: 50000,
      accumulative_bids: 25000,
      participants: 156,
      progress: 50,
      amount: "0.5",
      user: "0x1234567890abcdef1234567890abcdef12345678"
    },
    {
      pool_id: "002",
      nft_ids: ["nft_001"],
      reward_token_info: [
        {
          name: "Steady Teddy",
          token_id: "42",
          icon: "/nfts/steady-teddys/1.webp",
          decimals: 0
        }
      ],
      value: 12000,
      accumulative_bids: 8500,
      participants: 89,
      progress: 70.8,
      amount: "1",
      user: "0xabcdef1234567890abcdef1234567890abcdef12"
    },
    {
      pool_id: "003",
      nft_ids: null,
      reward_token_info: [
        {
          name: "BTC",
          token_id: "2",
          icon: "/btc.png",
          decimals: 8
        }
      ],
      value: 100000,
      accumulative_bids: 15000,
      participants: 234,
      progress: 15,
      amount: "1.0",
      user: "0x9876543210fedcba9876543210fedcba98765432"
    },
    {
      pool_id: "004",
      nft_ids: ["nft_002", "nft_003"],
      reward_token_info: [
        {
          name: "Steady Teddy",
          token_id: "88",
          icon: "/nfts/steady-teddys/2.webp",
          decimals: 0
        }
      ],
      value: 25000,
      accumulative_bids: 22000,
      participants: 67,
      progress: 88,
      amount: "2",
      user: "0xfedcba9876543210fedcba9876543210fedcba98"
    },
    {
      pool_id: "005",
      nft_ids: null,
      reward_token_info: [
        {
          name: "BTC",
          token_id: "3",
          icon: "/btc.png",
          decimals: 8
        }
      ],
      value: 75000,
      accumulative_bids: 60000,
      participants: 312,
      progress: 80,
      amount: "1.5",
      user: "0x5555555555555555555555555555555555555555"
    }
  ];

  // Use mock data if original poolList is empty, otherwise use original data
  const poolList =
    originalPoolList.length > 0 ? originalPoolList : mockPoolList;

  return (
    <div className="w-full bg-white mt-[30px] rounded-[16px] border border-[#F2F2F233] px-[30px] py-[20px]">
      <div className="flex items-center gap-[18px]">
        <div className="text-[20px] text-black font-[700] mb-[10px]">
          All Markets
        </div>
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
