import { CannonCoinsProvider, useBtcContext } from "./context";
// import WildTimeBid from "@/sections/wild-time/bid";
import MoreMarkets from "./components/more-markets";
import Header from "./components/header";
import BidSelection from "./components/bid-selection";
import BidsInfo from "./components/bids-info";
import MarketInfo from "./components/market-info";
import Grand from "./grand";
import DollaEye from "@/components/dolla-eye";
import TopWinner from "@/sections/winners";
import Music from "./components/music";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
import MarketsModal from "./components/more-markets/mobile/modal";
import { useAuth } from "@/contexts/auth";
import Button from "@/components/button";
import EstGas from "@/sections/est-gas";
import AvatarAction from "@/layouts/main/avatar-action";
import UserInfo from "@/sections/user-info";
import Wallet from "@/sections/wallet";
import "@/libs/howl";
import { useNavigate } from "react-router-dom";

// import ProvablyFair from "@/sections/provably-fair";

// import WildTimeBid from "@/sections/wild-time/bid";

export default function NewBTC() {
  return (
    <CannonCoinsProvider>
      <Content />
    </CannonCoinsProvider>
  );
}

const Content = () => {
  const { userInfo, login, nearAccount } = useAuth() || {};
  const isMobile = useIsMobile();
  const { pool } = useBtcContext();
  const navigate = useNavigate();
  return (
    <div
      className={clsx(
        "h-[100dvh] relative",
        isMobile && "flex flex-col",
        isMobile && pool?.status !== 1 ? "overflow-y-auto" : "overflow-hidden"
      )}
      style={{
        background: isMobile
          ? "radial-gradient(108.21% 50% at 50% 50%, rgba(0, 0, 0, 0.20) 0%, #000 100%), linear-gradient(0deg, rgba(31, 19, 255, 0.20) 0%, rgba(31, 19, 255, 0.20) 100%), url('/new-btc/m-bg.gif') lightgray 50% / cover no-repeat"
          : "radial-gradient(50% 50% at 50% 50%,rgba(0,0,0,0) 0%,#000 100%), url('/new-btc/bg.gif') lightgray 50% / cover no-repeat"
      }}
    >
      <DollaEye
        className="absolute top-[10px] left-[30px] z-[10] button"
        height={32}
        onClick={() => {
          navigate("/");
        }}
      />
      <div className="absolute top-[10px] right-[30px] z-[10] flex items-center gap-[12px]">
        <EstGas className="!bg-transparent !border-[#454545]" />

        {!userInfo ? (
          <Button onClick={login} className="w-[100px] h-[36px]">
            Connect
          </Button>
        ) : (
          <>
            <AvatarAction />
            {/* <Menu
            onClick={() => {
              logout();
            }}
          /> */}
          </>
        )}
      </div>
      {!isMobile && <Header className="h-[214px]" />}
      <MarketInfo />
      <Grand tokenBalance={nearAccount?.balance} />
      <BidSelection tokenBalance={nearAccount?.balance} />
      {!isMobile && <BidsInfo />}
      {!isMobile && <MoreMarkets />}
      {/* {!isMobile && (
        <div>
          <LucyDraw tokenBalance={nearAccount?.balance} />
        </div>
      )} */}
      {!isMobile && <TopWinner />}
      {!isMobile && <Music />}
      {isMobile && <MarketsModal />}
      <Wallet />
      <UserInfo />
    </div>
  );
};
