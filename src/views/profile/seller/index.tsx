import SwitchPanel from "@/components/switch/switch-panel";
// import Statistics from "../player/statistics";
// import UserInfo from "../player/user-info";
// import Invite from "../player/invite";
// import OrderList from "./order-list";
import useInfiniteScroll from "@/hooks/use-infinite-scroll";
import LoadingMore from "@/components/loading/loading-more";
import useCreatePoolList from "./hooks/use-create-pool-list";
// import { INVATE_ACTIVE } from "@/config";
import Header from "../header";
import Dashboard from "../ components/dashboard/index";
import { useState } from "react";
import Tabs from "@/components/tabs";
import { AnimatePresence } from "framer-motion";
import SellerMarkets from "./markets";
import Records from "./records";

const TabsList = [
  {
    key: "createdMarket",
    label: "Created Market"
  },
  {
    key: "records",
    label: "Records"
  }
];

export default function Seller() {
  const {
    data,
    loading,
    getCreatePoolList,
    updatePoolsData,
    hasMore,
    poolsData,
    records,
    recordsPrices,
    recordsLoading,
    onRecordsPrevPage,
    onRecordsNextPage,
    recordsPageIndex,
    recordsPageHasNextPage
  } = useCreatePoolList();

  // @ts-ignore
  const { containerRef, isLoading } = useInfiniteScroll(getCreatePoolList, {
    loading,
    hasMore,
    threshold: 100
  });

  const [tab, setTab] = useState(TabsList[0].key);

  return (
    <div
      className="w-full h-screen overflow-y-auto pb-[30px] max-md:overflow-x-hidden max-md:pb-[70px]"
      ref={containerRef}
    >
      <div className="pt-[30px] w-[933px] mx-auto max-md:w-full max-md:pt-[70px] max-md:bg-[url('/profile/bg.png')] max-md:bg-cover max-md:bg-no-repeat max-md:bg-[position:center_top_-44px]">
        <Header tab="seller" />
        <SwitchPanel className="max-md:w-full">
          <div className="max-md:px-[10px]">
            <Dashboard tab="seller" className="mt-[49px] max-md:mt-[20px]" />
          </div>
          <div className="flex justify-between items-center gap-[10px] mt-[44px] max-md:flex-col max-md:mt-[20px]">
            <Tabs
              currentTab={tab}
              onChangeTab={setTab}
              tabs={TabsList}
              className="!gap-[62px] max-md:!gap-[42px]"
              tabClassName="!text-[18px] !pb-[14px]"
              cursorClassName="!w-[30px] !bg-[#743EFF] left-1/2 -translate-x-1/2"
            />
          </div>
          <AnimatePresence>
            {tab === TabsList[0].key && (
              <SwitchPanel className="max-md:px-[10px]">
                <SellerMarkets
                  poolsData={poolsData}
                  orders={data}
                  loading={isLoading}
                  updatePoolsData={updatePoolsData}
                />
                {data.length > 0 && (
                  <LoadingMore
                    loading={isLoading}
                    hasMore={hasMore}
                    className="w-full"
                  />
                )}
              </SwitchPanel>
            )}
            {tab === TabsList[1].key && (
              <SwitchPanel>
                <Records
                  records={records}
                  recordsPrices={recordsPrices}
                  loading={recordsLoading}
                  onPrevPage={onRecordsPrevPage}
                  onNextPage={onRecordsNextPage}
                  currentPage={recordsPageIndex}
                  hasNextPage={recordsPageHasNextPage}
                />
              </SwitchPanel>
            )}
          </AnimatePresence>
        </SwitchPanel>
      </div>
    </div>
  );
}
