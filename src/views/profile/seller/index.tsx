import SwitchPanel from "@/components/switch/switch-panel";
// import Statistics from "../player/statistics";
// import UserInfo from "../player/user-info";
// import Invite from "../player/invite";
// import OrderList from "./order-list";
import useCreatePoolList from "./hooks/use-create-pool-list";
// import { INVATE_ACTIVE } from "@/config";
import Header from "../header";
import Dashboard from "../components/dashboard/index";
import SellerMarkets from "./markets";
import Records from "./records";
import PageBack from "../components/page-back";
import Bg from "../components/bg";
import ProfileTabs from "../components/tabs";
import RefreshIcon from "../components/refresh-icon";

export default function Seller() {
  const {
    data,
    loading,
    updatePoolsData,
    poolsData,
    records,
    recordsPrices,
    recordsLoading,
    onRecordsPrevPage,
    onRecordsNextPage,
    recordsPageIndex,
    recordsPageHasNextPage,
    poolsRefreshing,
    getCreatePoolList
  } = useCreatePoolList();

  return (
    <div className="w-full pb-[60px] max-md:overflow-x-hidden max-md:pb-[70px] relative">
      <PageBack />
      <div className="relative z-1 pt-[30px] w-[1200px] mx-auto max-md:w-full max-md:pt-[70px] max-md:bg-[url('/profile/bg.png')] max-md:bg-cover max-md:bg-no-repeat max-md:bg-[position:center_top_-44px]">
        <Header />
        <ProfileTabs tab="seller" />
        <SwitchPanel className="max-md:w-full">
          <div className="max-md:px-[10px]">
            <Dashboard tab="seller" className="mt-[49px] max-md:mt-[20px]" />
          </div>
          <div className="w-full flex justify-between items-center gap-[10px] mt-[20px] pr-[20px] max-md:flex-col max-md:mt-[20px]">
            <div> Created Market {data?.length}</div>
            <RefreshIcon
              refreshing={poolsRefreshing}
              onClick={() => {
                if (poolsRefreshing) return;
                getCreatePoolList();
              }}
            />
          </div>
          <SellerMarkets
            poolsData={poolsData}
            orders={data}
            loading={loading}
            updatePoolsData={updatePoolsData}
          />
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
      </div>
      <Bg />
    </div>
  );
}
