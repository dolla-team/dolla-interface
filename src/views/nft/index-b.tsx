import { CannonCoinsProvider, useNftContext } from "./context";
// import WildTimeBid from "@/sections/wild-time/bid";
import Header from "./components/header";
import BidSelection from "./components/bid-selection";
import BidsInfo from "./components/bids-info";
import Grand from "./grand";
// import Music from "./components/music";
import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
import { useAuth } from '@/contexts/wallet'
import ApproveModal from "./components/approve-modal";

// import ProvablyFair from "@/sections/provably-fair";

// import WildTimeBid from "@/sections/wild-time/bid";

export default function NewNft() {
  return (
    <CannonCoinsProvider>
      <Content />
    </CannonCoinsProvider>
  );
}

const Content = () => {
  const { nearAccount } = useAuth() || {};

  const isMobile = useIsMobile();
  const { pool } = useNftContext();
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
          : "radial-gradient(50% 50% at 50% 50%,rgba(0,0,0,0) 0%,#000 100%), url('/nft/bg.gif') lightgray 50% / cover no-repeat"
      }}
    >
      {!isMobile && <Header className="h-[112px]" />}
      <ApproveModal />
      <Grand tokenBalance={nearAccount?.balance} />
      <BidSelection tokenBalance={nearAccount?.balance} />
      {!isMobile && <BidsInfo />}

      {/* {!isMobile && <TopWinner />} */}
      {/* {!isMobile && <Music />} */}
    </div>
  );
};
