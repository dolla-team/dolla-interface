import Tabs from "@/components/tabs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PageTabs() {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
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
      className="absolute left-[50%] translate-x-[-50%] w-[572px] h-[50px] p-[4px] border border-[#E4E4E4] bg-[#F2F2F299] rounded-[16px] backdrop-blur-[25px] uppercase"
      tabClassName="text-[14px] w-1/3 text-center !text-[#8A87AA] h-[42px] leading-[42px]"
      activeClassName="!text-white"
      cursorClassName="!bg-[#6F37FF] h-[42px] rounded-[12px] w-full !bottom-[0px]"
    />
  );
}
