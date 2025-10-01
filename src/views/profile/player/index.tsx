import SwitchPanel from "@/components/switch/switch-panel";
// import ProfileChart from "./profile-chart";
// import History from "./history";
// import UserInfo from "./user-info";
// import Invite from "./invite";
// import { INVATE_ACTIVE } from "@/config";
import Header from "../header";
import Dashboard from "../components/dashboard/index";
import { useRef, useMemo } from "react";
import PlayerMarkets from "./markets";
import Records from "./records";
import usePlayerHistory from "./hooks/use-player-history";
import PageBack from "../components/page-back";
import Bg from "../components/bg";
import ProfileTabs from "../components/tabs";
import Objectives from "./objectives";

export default function Player() {
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
    onJoinedPoolListStatusChange
  } = usePlayerHistory();

  const containerRef = useRef<any>(null);

  const dataHeight = useMemo(() => {
    return data?.length * 50;
  }, [data]);

  return (
    <div
      className="w-full pb-[60px] border-box max-md:overflow-x-hidden max-md:pb-[70px] relative"
      ref={containerRef}
    >
      <PageBack />
      <div className="relative z-1 pt-[30px] w-[1200px] mx-auto max-md:w-full max-md:pt-[70px] max-md:bg-[url('/profile/bg.png')] max-md:bg-cover max-md:bg-no-repeat max-md:bg-[position:center_top_-44px]">
        <Header />
        <ProfileTabs tab="player" />
        <SwitchPanel className="max-md:w-full">
          <div className="max-md:px-[10px]">
            <Dashboard tab="player" className="mt-[20px] max-md:mt-[20px]" />
          </div>
          <div className="mt-[15px] flex gap-[20px]">
            <Objectives dataHeight={dataHeight} />
            <div className="w-[780px]">
              <PlayerMarkets
                orders={joinedPoolListData}
                loading={joinedPoolListLoading}
                pageIndex={joinedPoolListPageIndex}
                hasNextPage={joinedPoolListHasNextPage}
                onPageChange={onJoinedPoolListPageChange}
                updatePoolsData={updateJoinedPoolListData}
                status={joinedPoolListStatus}
                onStatusChange={onJoinedPoolListStatusChange}
              />
              <Records
                page={page}
                loading={loading}
                data={data}
                hasMore={hasMore}
                onPageChange={onPageChange}
                fullAction={true}
              />
            </div>
          </div>
        </SwitchPanel>
      </div>
      <Bg />
    </div>
  );
}
