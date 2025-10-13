import Top from "./top";
import { QUOTE_TOKEN } from "@/config/btc";
import { formatNumber } from "@/utils/format/number";
import Tabs from "@/components/tabs";
import Tokens from "./tokens";
import Nfts from "./nfts";
import Txs from "./txs";
import { useState } from "react";
import useBalance from "@/hooks/near/use-balance";
import useWalletStore from "@/stores/use-wallet";

export default function Info({
  onTabChange
}: {
  onTabChange: (tab: string) => void;
}) {
  const [tab, setTab] = useState(0);
  const { balance } = useBalance();
  const walletStore = useWalletStore();
  return (
    <div className="h-full w-full relative">
      <Top />
      <div className="py-[10px]">
        <div className="flex justify-center items-center gap-[16px] pb-[10px]">
          {/* <img
            src={QUOTE_TOKEN.icon}
            className="w-[36px] h-[36px] rounded-full"
          /> */}
          <div className="text-[32px] font-[600] text-black">
            {formatNumber(balance || 0, 2, true, { prefix: "$" })}
          </div>
        </div>
        {/* <div className="text-[12px] text-[#8A87AA] text-center">
          Dolla supports {QUOTE_TOKEN.symbol} as bet coin.{" "}
        </div> */}
        <div className="px-[20px] flex items-center gap-[14px] mt-[16px] text-black border-b border-b-[#D9D9D9] pb-[30px]">
          {PANELS.map((panel) => (
            <div
              key={panel.label}
              className="button flex flex-col items-center justify-center gap-[4px] w-[116px] h-[60px] rounded-[10px] bg-[#0000000D]"
              onClick={() => onTabChange(panel.label.toLowerCase())}
            >
              {panel.icon}
              <div className="text-[12px]">{panel.label}</div>
            </div>
          ))}
        </div>
      </div>
      <Tabs
        tabs={TABS}
        currentTab={tab}
        onChangeTab={setTab}
        className="w-full !gap-0"
        tabClassName="h-[38px] text-[14px] font-[600] text-center !text-[#8A87AA] !pb-0 leading-[30px] mx-[20px]"
        activeClassName="!text-black"
        cursorClassName="!bg-[#000] !rounded-[0px] !bottom-[2px]"
      />
      <div className="h-[calc(100vh-300px)] overflow-y-auto p-[15px]">
        {tab === 0 && (
          <Tokens
            onClick={() => {
              onTabChange("deposit");
              walletStore.set({ depositMethod: "centralized-exchange" });
            }}
          />
        )}
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
          stroke="currentColor"
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
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 11.8957C16.4667 19.9584 4.64444 20.4068 2.11111 11M2.11111 11L1 14M2.11111 11L4.5 11.8957"
          stroke="currentColor"
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
          stroke="currentColor"
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
    label: "Tokens",
    key: 0
  },
  // {
  //   label: "NFTs",
  //   key: 1
  // },
  {
    label: "History",
    key: 2
  }
];
