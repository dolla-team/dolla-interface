import Tabs from "@/components/tabs";
import { useNftContext } from "../context";

export default function BidSelection({ disabled }: any) {
  const { bids, setBids, flipStatus } = useNftContext();
  return (
    <Tabs
      tabs={[
        { label: "$1", key: 1 },
        { label: "$5", key: 5 },
        { label: "$10", key: 10 },
        { label: "$20", key: 20 }
      ]}
      currentTab={bids}
      onChangeTab={(tab: any) => {
        if (flipStatus === 1 || disabled) return;
        setBids(tab);
      }}
      className="mt-[10px] w-[328px] h-[66px] rounded-[20px] border border-[#E4E4E4] bg-[#FFFFFF99] p-[8px] !gap-0"
      tabClassName="text-[16px] font-[900] !w-1/4 text-center !text-[#2B3337] h-[50px] leading-[50px]"
      activeClassName="!text-white"
      cursorClassName="!bg-[#6F37FF] h-[50px] rounded-[16px] w-full !bottom-[0px]"
    />
  );
}
