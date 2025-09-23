import { useAuth } from "@/contexts/auth";
import Top from "./top";
import config from "@/config/bera";
import { formatNumber } from "@/utils/format/number";
import Tabs from "@/components/tabs";
import Tokens from "./tokens";
import Nfts from "./nfts";
import Txs from "./txs";
import { useState } from "react";

export default function Info({
  onTabChange
}: {
  onTabChange: (tab: string) => void;
}) {
  const { nearAccount } = useAuth() || {};
  const [tab, setTab] = useState(0);
  return (
    <div className="h-full w-full">
      <Top />
      <div className="pt-[20px]">
        <div className="flex justify-center items-center gap-[16px]">
          <img
            src={config.purchaseToken?.icon || ''}
            className="w-[36px] h-[36px] rounded-full"
          />
          <div className="text-[36px] text-black">
            {formatNumber(nearAccount?.balance || 0, 2, true, { prefix: "$" })}
          </div>
        </div>
        <div className="text-[12px] text-[#8A87AA] text-center">
          Dolla NFT supports HONEY as bet coin.{" "}
        </div>
        <div className="px-[20px] flex items-center gap-[14px] mt-[16px]">
          {PANELS.map((panel) => (
            <div
              key={panel.label}
              className="button flex flex-col items-center justify-center gap-[4px] w-[116px] h-[60px] rounded-[10px] border border-[#383F47] bg-[#1A1E24]"
              onClick={() => onTabChange(panel.label.toLowerCase())}
            >
              {panel.icon}
              <div className="text-[12px] text-white">{panel.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Tabs
        tabs={TABS}
        currentTab={tab}
        onChangeTab={setTab}
        className="w-full !gap-0 border-b border-[#D9D9D9] mt-[20px]"
        tabClassName="h-[38px] text-[14px] text-center !text-[#8A87AA] !pb-0 leading-[30px] mx-[20px]"
        activeClassName="!text-black"
        cursorClassName="!bg-[#743EFF]"
      />
      <div className="h-[calc(100vh-346px)] overflow-y-auto p-[15px]">
        {tab === 0 && <Tokens onDeposit={() => onTabChange("deposit")} />}
        {tab === 1 && (
          <Nfts
            onDeposit={() => onTabChange("deposit")}
            onSend={() => onTabChange("deposit")}
          />
        )}
        {tab === 2 && <Txs />}
      </div>
    </div>
  );
}

const PANELS = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="16"
        viewBox="0 0 14 16"
        fill="none"
      >
        <path
          d="M7 1V15M7 15L1 9.06061M7 15L13 9.06061"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Deposit"
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="19"
        viewBox="0 0 21 19"
        fill="none"
      >
        <path
          d="M2 7.10432C4.53333 -0.958446 16.3556 -1.4068 18.8889 8M18.8889 8L20 5M18.8889 8L16.5 7.10432"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 11.8957C16.4667 19.9584 4.64444 20.4068 2.11111 11M2.11111 11L1 14M2.11111 11L4.5 11.8957"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Swap"
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="16"
        viewBox="0 0 14 16"
        fill="none"
      >
        <path
          d="M7 15V1M7 1L1 6.93939M7 1L13 6.93939"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Withdraw"
  }
];

const TABS = [
  {
    label: "Token",
    key: 0
  },
  {
    label: "NFTs",
    key: 1
  },
  {
    label: "Transaction History",
    key: 2
  }
];
