import { CannonCoinsProvider, useBtcContext } from "./context";
// import WildTimeBid from "@/sections/wild-time/bid";
import MoreMarkets from "./components/more-markets";
import Header from "./components/header";
import BidSelection from "./components/bid-selection";
import BidsInfo from "./components/bids-info";
import MarketInfo from "./components/market-info";
import Grand from "./grand";
import LucyDraw from "../../sections/lucy-draw";
import { QUOTE_TOKEN } from "@/config/btc";
import useTokenBalance from "@/hooks/solana/use-token-balance";
import TopWinner from "@/sections/winners";
import Music from "./components/music";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
import MarketsModal from "./components/more-markets/mobile/modal";

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
  const { tokenBalance, update } = useTokenBalance({
    address: QUOTE_TOKEN.address,
    decimals: QUOTE_TOKEN.decimals
  });

  const isMobile = useIsMobile();
  const { pool } = useBtcContext();
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
      {!isMobile && <Header className="h-[214px]" />}
      <MarketInfo />
      <Grand tokenBalance={tokenBalance} update={update} />
      <BidSelection tokenBalance={tokenBalance} update={update} />
      {!isMobile && <BidsInfo />}
      {!isMobile && <MoreMarkets />}
      {!isMobile && <LucyDraw tokenBalance={tokenBalance} update={update} />}
      {!isMobile && <TopWinner />}
      {!isMobile && <Music />}
      {isMobile && <MarketsModal />}
    </div>
  );
};
