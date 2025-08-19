import Withdraw from "@/sections/cashier/panels/withdraw-evm";
import Tabs from "@/components/tabs";
import { useState } from "react";
import WithdrawNft from "./withdraw-nft";

export default function WithdrawPanel({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState("token");
  return (
    <div className="px-[20px] pt-[30px]">
      <div
        className="flex items-center gap-[18px] text-[16px] cursor-pointer button"
        onClick={onBack}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="18"
          viewBox="0 0 10 18"
          fill="none"
        >
          <path
            d="M9 1L2 9L9 17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <div className="text-white">Withdraw</div>
      </div>
      <Tabs
        tabs={[
          { label: "Token", key: "token" },
          { label: "NFT", key: "nft" }
        ]}
        currentTab={tab}
        onChangeTab={setTab}
        className="w-[162px] h-[38px] p-[4px] !gap-0 mt-[20px] border border-[#383F47] rounded-[20px] mx-auto"
        tabClassName="text-[12px] text-center w-[80px] leading-[30px] !pb-0"
        activeClassName="!text-white"
        cursorClassName="!bg-[#743EFF] h-[30px] rounded-[16px]"
      />
      {tab === "token" && <Withdraw />}
      {tab === "nft" && <WithdrawNft />}
    </div>
  );
}
