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
import { useNavigate } from "@/libs/router";
import { ShareBtn, CloseBtn } from "./share-btn";
import Loading from "./loading";
import Wallet from "@/sections/wallet";
import Tips from "./components/tips";
import Result from "./components/result";
import { useEffect, useMemo } from "react";
import useWalletStore from "@/stores/use-wallet";
import LucyDraw from "@/sections/lucy-draw";
import { BET_UNIT } from "@/config";
import { useContractConfigStore } from "@/stores/use-contract-config";
import useBid from "@/hooks/near/use-bid";
import useToast from "@/hooks/use-toast";
import useBtcDetailStore from "@/stores/use-btc-detail";

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
  const { nearAccount, login } = useAuth() || {};
  const isMobile = useIsMobile();
  const { pool, flipStatus, onReset, setFlipStatus, bids, setTaskId } =
    useBtcContext();
  const navigate = useNavigate();
  const walletStore = useWalletStore();
  const { userInfo } = useAuth();
  const contractConfig = useContractConfigStore((state) => state.config);
  const toast = useToast();
  const btcDetailStore = useBtcDetailStore();
  const { onBid } = useBid(
    pool?.pool_id,
    // (result) => {
    //   setFlipStatus(bids === 1 ? 5 : 4);
    //   btcDetailStore.set({ bidResult: result });
    //   console.log("success", 4);
    // },
    (taskId: string) => {
      setFlipStatus(2);
      console.log("tx success", 2);
      setTaskId(taskId);
    },
    () => {
      setTimeout(() => {
        setFlipStatus(0);
        onReset(true);
        toast.fail({
          title: "Bid failed"
        });
      }, 30);
    },
    () => {
      setFlipStatus(0);
    }
  );

  const onBidClick = () => {
    if (disabled) {
      return;
    }
    if (!userInfo?.user) {
      login();
      return;
    }
    if (flipStatus === 6) {
      onReset();
    }
    btcDetailStore.set({ bidResult: null });
    setFlipStatus(1);
    onBid(bids);
  };

  useEffect(() => {
    walletStore.init();
  }, []);

  const [points, tickets, sumPoints, sumTickets, isWinner] = useMemo(() => {
    if (!btcDetailStore.bidResult) {
      return [[], [], 0, 0, false];
    }
    const _p = btcDetailStore.bidResult.winner_point
      ? btcDetailStore.bidResult.winner_point.split(",")
      : [];

    const _t = btcDetailStore.bidResult.winner_ticket
      ? btcDetailStore.bidResult.winner_ticket?.split(",")
      : [];
    const _pt = _p.reduce((acc: number, curr: string) => acc + Number(curr), 0);
    const _tt = _t.reduce(
      (acc: number, curr: string) => acc + Number(curr === "0" ? 1 : 0),
      0
    );

    return [_p, _t, _pt, _tt, btcDetailStore.bidResult.is_winner];
  }, [btcDetailStore.bidResult]);

  const [disabled, balanceNotEnough] = useMemo(() => {
    if (pool?.status !== 1) {
      return [true, false];
    }
    if (!userInfo?.user) {
      return [true, false];
    }

    if (
      Number(nearAccount?.balance) <
      bids * (Number(BET_UNIT) / 1e6) + contractConfig.play_game_fee
    ) {
      return [true, true];
    }
    if (flipStatus === 0 || flipStatus === 6) {
      return [false, false];
    }
    return [true, false];
  }, [flipStatus, userInfo, nearAccount?.balance, bids, pool]);

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
        {(pool?.status === 1 || pool?.status === 2) && <ShareBtn />}
        <CloseBtn />
      </div>
      {!isMobile && <Header className="h-[214px]" />}
      <MarketInfo />
      <Grand
        tokenBalance={nearAccount?.balance}
        {...{ sumPoints, sumTickets, isWinner, points, tickets }}
      />
      <BidSelection
        tokenBalance={nearAccount?.balance}
        disabled={disabled}
        balanceNotEnough={balanceNotEnough}
        onBidClick={onBidClick}
      />
      {!isMobile && <LucyDraw from="detail" poolStatus={pool?.status} />}
      {!isMobile && <BidsInfo />}
      {/* {!isMobile && <MoreMarkets />} */}
      {/* {!isMobile && (
        <div>
          <LucyDraw tokenBalance={nearAccount?.balance} />
        </div>
      )} */}
      {/* {!isMobile && <TopWinner />} */}
      {!isMobile && !btcDetailStore.bidResult?.is_winner && <Music />}
      {/* {isMobile && <MarketsModal />} */}
      <Wallet />
      {pool?.status === 1 && <Tips />}
      {flipStatus > 5 && (
        <Result
          points={sumPoints}
          tickets={sumTickets}
          onClose={() => {
            setFlipStatus(0);
            onReset();
          }}
          isWinner={isWinner}
          disabled={disabled}
          balanceNotEnough={balanceNotEnough}
          onBidClick={onBidClick}
        />
      )}
    </div>
  );
};
