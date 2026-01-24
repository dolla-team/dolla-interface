import { CannonCoinsProvider, useBtcContext } from "./context";
import { useAuth } from "@/contexts/auth";
import "@/libs/howl";
import { useEffect, useMemo } from "react";
import useWalletStore from "@/stores/use-wallet";
import { BET_UNIT } from "@/config";
import { useContractConfigStore } from "@/stores/use-contract-config";
import useBid from "@/hooks/near/use-bid";
import useToast from "@/hooks/use-toast";
import BtcContent from "./content";
import BtcDetailContent from "../btc-detail";



export default function NewBTC() {
  return (
    <CannonCoinsProvider>
      <BTC />
    </CannonCoinsProvider>
  );
}

function BTC() {
  const { nearAccount, login } = useAuth() || {};
  const {
    pool,
    flipStatus,
    onReset,
    setFlipStatus,
    bids,
    setTaskId,
    showDetail,
    onUpdatePool
  } = useBtcContext();

  const walletStore = useWalletStore();
  const { userInfo } = useAuth();
  const contractConfig = useContractConfigStore((state) => state.config);
  const toast = useToast();
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
    (type?: string, pool?: any) => {
      if (type === "pool_status_changed") {
        onUpdatePool(pool);
        toast.fail({
          title: "Pool status has been changed"
        });
      }
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

    setFlipStatus(1);
    onBid(bids);
  };

  useEffect(() => {
    walletStore.init();
  }, []);

  const [disabled, balanceNotEnough] = useMemo(() => {
    // return [false, false];
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
    <>
      {showDetail ? (
        <BtcDetailContent
          disabled={disabled}
          balanceNotEnough={balanceNotEnough}
          onBidClick={onBidClick}
        />
      ) : (
        <BtcContent
          disabled={disabled}
          balanceNotEnough={balanceNotEnough}
          onBidClick={onBidClick}
        />
      )}
    </>
  );
}
