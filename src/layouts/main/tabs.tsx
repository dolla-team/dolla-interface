import Tabs from "@/components/tabs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useIsBtc from "@/hooks/use-is-btc";
import clsx from "clsx";

export default function PageTabs() {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const isBtc = useIsBtc();
  return (
    <Tabs
      tabs={[
        { label: "Bid for BTC", key: 0 },
        { label: "Bid for NFT", key: 1 }
      ]}
      currentTab={tab}
      onChangeTab={(tab: any) => {
        setTab(tab);
        navigate(tab === 0 ? "/btc" : "/nft");
      }}
      className="absolute left-[50%] translate-x-[-50%] w-[352px] h-[50px] p-[4px] !gap-0 border border-[#E4E4E4] bg-[#F2F2F299] rounded-[16px] backdrop-blur-[25px] uppercase"
      tabClassName={clsx(
        "text-[14px] w-1/2 text-center h-[42px] leading-[42px] text-[#2B3337]"
      )}
      activeClassName={clsx(!isBtc && "!text-white")}
      cursorClassName={clsx(
        "h-[42px] rounded-[12px] w-full !bottom-[0px]",
        isBtc ? "!bg-[#FFC42F]" : "!bg-[#6F37FF]"
      )}
    />
  );
}
