import { CannonCoinsProvider, useBtcContext } from "./context";
// import WildTimeBid from "@/sections/wild-time/bid";
// import MoreMarkets from "./components/more-markets";
import Header from "./components/header";
import BidSelection from "./components/bid-selection";
import BidsInfo from "./components/bids-info";
import MarketInfo from "./components/market-info";
import Grand from "./grand";
import DollaEye from "@/components/dolla-eye";
import Music from "./components/music";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
// import MarketsModal from "./components/more-markets/mobile/modal";
import { useAuth } from "@/contexts/auth";
import "@/libs/howl";
import { useNavigate } from "react-router-dom";
import { ShareBtn, CloseBtn } from "./share-btn";
import Loading from "./loading";
import Wallet from "@/sections/wallet";
import Tips from "./components/tips";
import Result from "./components/result";
import { useEffect, useMemo } from "react";
import useWalletStore from "@/stores/use-wallet";
import Confetti from "@/components/confetti";
import LucyDraw from "@/sections/lucy-draw";

// import ProvablyFair from "@/sections/provably-fair";

// import WildTimeBid from "@/sections/wild-time/bid";

export default function NewBTC() {
  return (
    <CannonCoinsProvider>
      <Content />
      <Loading />
    </CannonCoinsProvider>
  );
}

const Content = () => {
  const { nearAccount } = useAuth() || {};
  const isMobile = useIsMobile();
  const { pool, bidResult, flipStatus, onReset, setFlipStatus } =
    useBtcContext();
  const navigate = useNavigate();
  const walletStore = useWalletStore();
  useEffect(() => {
    walletStore.init();
  }, []);

  const [points, tickets, sumPoints, sumTickets, isWinner] = useMemo(() => {
    if (!bidResult) {
      return [[], [], 0, 0, false];
    }
    const _p = bidResult.point
      ? bidResult.point.wild_coin_ev_result.split(",")
      : [];
    const _t = bidResult.ticket ? bidResult.ticket?.result?.split(",") : [];
    const _pt = _p.reduce((acc: number, curr: string) => acc + Number(curr), 0);
    const _tt = _t.reduce(
      (acc: number, curr: string) => acc + Number(curr === "0" ? 1 : 0),
      0
    );

    return [_p, _t, _pt, _tt, bidResult.bid.is_winner];
  }, [bidResult]);

  return (
    <div
      className={clsx(
        "h-[100dvh] relative",
        isMobile && "flex flex-col",
        isMobile && pool?.status !== 1 ? "overflow-y-auto" : "overflow-hidden",
        !isMobile && "bg-blend-luminosity"
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

      <div className="absolute top-[10px] right-[30px] z-[10] flex items-center gap-[20px]">
        <ShareBtn />
        <CloseBtn />
      </div>
      {!isMobile && <Header className="h-[214px]" />}
      <MarketInfo />
      <Grand
        tokenBalance={nearAccount?.balance}
        {...{ sumPoints, sumTickets, isWinner, points, tickets }}
      />
      <BidSelection tokenBalance={nearAccount?.balance} />
      {!isMobile && <LucyDraw from="detail" poolStatus={pool?.status} />}
      {!isMobile && <BidsInfo />}
      {/* {!isMobile && <MoreMarkets />} */}
      {/* {!isMobile && (
        <div>
          <LucyDraw tokenBalance={nearAccount?.balance} />
        </div>
      )} */}
      {/* {!isMobile && <TopWinner />} */}
      {!isMobile && !bidResult?.bid?.is_winner && <Music />}
      {/* {isMobile && <MarketsModal />} */}
      <Wallet />
      {pool?.status === 1 && <Tips />}
      {flipStatus === 6 && (
        <Result
          points={sumPoints}
          tickets={sumTickets}
          onClose={() => {
            setFlipStatus(0);
            onReset();
          }}
          isWinner={isWinner}
        />
      )}
      {bidResult?.bid?.is_winner && flipStatus > 4 && <Confetti />}
    </div>
  );
};
