import SwitchPanel from "@/components/switch/switch-panel";
// import ProfileChart from "./profile-chart";
// import History from "./history";
// import UserInfo from "./user-info";
// import Invite from "./invite";
// import { INVATE_ACTIVE } from "@/config";
import Header from "../header";
import Dashboard from "../ components/dashboard/index";
import Tabs from "@/components/tabs";
import { useRef, useState, useEffect, useCallback } from "react";
import Radio from "@/components/radio";
import PlayerMarkets from "./markets";
import { AnimatePresence } from "framer-motion";
import Records from "./records";
import usePlayerHistory from "./hooks/use-player-history";
import LoadingMore from "@/components/loading/loading-more";
import { useDebounceFn } from "ahooks";

const TabsList = [
  {
    key: "joinedMarket",
    label: "Joined Market"
  },
  {
    key: "records",
    label: "Records"
  }
];

export default function Player() {
  const [tab, setTab] = useState(TabsList[0].key);

  const {
    page,
    loading,
    data,
    hasMore,
    onPageChange,

    joinedPoolListHasNextPage,
    joinedPoolListPageIndex,
    joinedPoolListLoading,
    joinedPoolListData,
    updateJoinedPoolListData,
    onJoinedPoolListPageChange,
    joinedPoolListStatus,
    onJoinedPoolListStatusChange,
  } = usePlayerHistory();

  const containerRef = useRef<any>(null);
  const marketsBottomRef = useRef<any>(null);

  const { run: handleLoadMore } = useDebounceFn(() => {
    if (
      joinedPoolListData.length > 0 &&
      joinedPoolListHasNextPage &&
      !joinedPoolListLoading
    ) {
      onJoinedPoolListPageChange(joinedPoolListPageIndex + 1);
    }
  }, {
    wait: 500
  });

  useEffect(() => {
    if (!marketsBottomRef.current || joinedPoolListData.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            joinedPoolListHasNextPage &&
            !joinedPoolListLoading
          ) {
            handleLoadMore();
          }
        });
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1
      }
    );

    observer.observe(marketsBottomRef.current);

    return () => {
      if (marketsBottomRef.current) {
        observer.unobserve(marketsBottomRef.current);
      }
    };
  }, [
    joinedPoolListData.length,
    joinedPoolListHasNextPage,
    joinedPoolListLoading,
    joinedPoolListPageIndex,
  ]);

  return (
    <div
      className="w-full h-screen overflow-y-auto pb-[30px] max-md:overflow-x-hidden max-md:pb-[70px]"
      ref={containerRef}
    >
      <div className="pt-[30px] w-[933px] mx-auto max-md:w-full max-md:pt-[70px]">
        <Header tab="player" />
        <SwitchPanel className="max-md:w-full">
          <div className="max-md:px-[10px]">
            <Dashboard tab="player" className="mt-[49px] max-md:mt-[20px]" />
          </div>
          <div className="flex justify-between items-center gap-[10px] mt-[44px] max-md:flex-col max-md:mt-[20px]">
            <Tabs
              currentTab={tab}
              onChangeTab={setTab}
              tabs={TabsList}
              className="!gap-[62px] max-md:!gap-[42px]"
              tabClassName="!text-[18px] !pb-[14px] font-[SpaceGrotesk]"
              cursorClassName="!w-[30px] !bg-[#FFC42F] left-1/2 -translate-x-1/2"
            />
            {tab === TabsList[0].key && (
              <div className="flex items-center justify-end gap-[15px] max-md:ml-auto max-md:mr-[10px]">
                <Radio
                  checked={joinedPoolListStatus === "0,1"}
                  onChange={(_value: any) => {
                    if (_value === joinedPoolListStatus) {
                      onJoinedPoolListStatusChange("");
                      return;
                    }
                    onJoinedPoolListStatusChange(_value);
                  }}
                  name="joinedMarketFilter"
                  value="0,1"
                >
                  Live only
                </Radio>
              </div>
            )}
          </div>
          <AnimatePresence>
            {tab === TabsList[0].key && (
              <SwitchPanel className="max-md:px-[10px]">
                <PlayerMarkets
                  orders={joinedPoolListData}
                  loading={joinedPoolListLoading}
                  pageIndex={joinedPoolListPageIndex}
                  hasNextPage={joinedPoolListHasNextPage}
                  onPageChange={onJoinedPoolListPageChange}
                  updatePoolsData={updateJoinedPoolListData}
                />
                <div
                  ref={marketsBottomRef}
                  className="h-[40px] flex justify-center items-center"
                >
                  {
                    joinedPoolListData?.length > 0 && (
                      <LoadingMore loading={joinedPoolListLoading} hasMore={joinedPoolListHasNextPage} />
                    )
                  }
                </div>
              </SwitchPanel>
            )}
            {tab === TabsList[1].key && (
              <SwitchPanel>
                <Records
                  page={page}
                  loading={loading}
                  data={data}
                  hasMore={hasMore}
                  onPageChange={onPageChange}
                />
              </SwitchPanel>
            )}
          </AnimatePresence>
        </SwitchPanel>
      </div>
    </div>
  );
}
