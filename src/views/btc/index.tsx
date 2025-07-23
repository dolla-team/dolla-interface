import { CannonCoinsProvider } from "./context";
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
// import ProvablyFair from "@/sections/provably-fair";

// import WildTimeBid from "@/sections/wild-time/bid";

export default function NewBTC() {
  const { tokenBalance, update } = useTokenBalance({
    address: QUOTE_TOKEN.address,
    decimals: QUOTE_TOKEN.decimals
  });
  return (
    <CannonCoinsProvider>
      <div className="h-screen overflow-hidden bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0)_0%,#000_100%),url('/new-btc/bg.gif')] bg-cover bg-center relative">
        <Header className="h-[214px]" />
        {/* 
        <Bid className="h-[106px]" />
        <Players className="h-[148px] mt-[-1px]" />
        <WildTimeBid /> */}
        <Grand className="h-[calc(100vh-416px)] pt-[25px]" />
        <BidSelection tokenBalance={tokenBalance} update={update} />
        <BidsInfo />
        <MarketInfo />
        <MoreMarkets />
        <LucyDraw tokenBalance={tokenBalance} update={update} />
        <TopWinner />
        {/* <ProvablyFair /> */}
      </div>
    </CannonCoinsProvider>
  );
}
