import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import usePoolRecommend from "@/hooks/use-pool-recommend";
import { useParams } from "react-router-dom";
import usePoolInfo from "@/hooks/use-pool-info";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import { useAuth } from "@/contexts/auth";
import useWinnerBidList from "./detail/use-winner-bid-list";
import useBtcDetailStore from "@/stores/use-btc-detail";

export const CannonCoinsContext = createContext<any>({});

export const CannonCoinsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [taskId, setTaskId] = useState<string>("");
  const coinsRef = useRef<any>({});
  const flipedNumberRef = useRef(0);
  const params = useParams();
  const { onQueryUserInfo } = useAuth();
  const { onQueryPoolInfo } = usePoolInfo();
  const [pool, setPool] = useState<any>(null);
  const { data, getPoolRecommend } = usePoolRecommend(0, !params?.poolId);
  const [mobileMarketsOpen, setMobileMarketsOpen] = useState(false);
  const [filterVolume, setFilterVolume] = useState(0);
  const poolCachedRef = useRef<any>(null);
  const { winnerBidList } = useWinnerBidList(pool);
  const [showDetail, setShowDetail] = useState(true);
  const btcDetailStore = useBtcDetailStore();
  const onMobileMarketsClose = () => {
    setMobileMarketsOpen(false);
  };

  useEffect(() => {
    if (btcDetailStore.flipStatus === 0) {
      window.howl.bgm.fade(0.1, 0.2, 1000);
    }

    if (btcDetailStore.flipStatus === 1 || btcDetailStore.flipStatus === 0) {
      flipedNumberRef.current = 0;
    }

    if (btcDetailStore.flipStatus === 2) {
      for (let i = 0; i < btcDetailStore.bids; i++) {
        coinsRef.current[i]?.collect();
      }
      setTimeout(() => {
        btcDetailStore.set({ flipStatus: 3 });
      }, 600);
    }

    if (btcDetailStore.flipStatus === 4) {
      window.howl.bgm.fade(0.2, 0, 1000);
      for (let i = 0; i < btcDetailStore.bids; i++) {
        coinsRef.current[i]?.revert();
      }
    }

    if (btcDetailStore.flipStatus === 5) {
      if (btcDetailStore.bids === 1) {
        coinsRef.current[0]?.revert();
        coinsRef.current[0]?.flip();
      } else {
        coinsRef.current[0]?.flip();
        // for (let i = 0; i < bids; i++) {
        //   coinsRef.current[i]?.flip(false, true);
        // }
      }
    }

    if (btcDetailStore.flipStatus === 6 && poolCachedRef.current) {
      if (params?.poolId) {
        setPool(poolCachedRef.current);
      }
      if (!params?.poolId && !btcDetailStore.bidResult?.is_winner) {
        clearTimeout(window.poolTimer);
        getPoolRecommend();
      }
    }
  }, [btcDetailStore.flipStatus]);

  const loopUpdatePool = async (_pool: any) => {
    clearTimeout(window.poolTimer);

    if (_pool?.status === 1) {
      const res = await onQueryPoolInfo(_pool?.pool_id);
      if (res?.status === 1) {
        setPool(res);
        window.poolTimer = setTimeout(() => {
          loopUpdatePool(res || _pool);
        }, 10000);
      } else {
        poolCachedRef.current = res;
      }
    } else {
      clearTimeout(window.poolTimer);
    }
  };

  useEffect(() => {
    if (!params?.poolId) return;
    let count = 0;

    const updatePool = async () => {
      const res = await onQueryPoolInfo(Number(params.poolId));
      if (res) {
        setPool(res);

        window.poolTimer = setTimeout(() => {
          loopUpdatePool(res);
        }, 10000);
      } else {
        clearTimeout(window.poolTimer);
        if (count < 5) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          updatePool();
        }
        count++;
      }
    };
    updatePool();
  }, [params?.poolId]);

  useEffect(() => {
    if (data?.id) {
      setPool(data);
      loopUpdatePool(data);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      clearTimeout(window.poolTimer);
    };
  }, []);

  const [poolAmount] = useMemo(() => {
    if (!pool) return ["0"];
    const reward_amount = pool.reward_amount || 0;
    const decimals = pool.reward_token_info?.[0]?.decimals || 1;
    const _a = formatNumber(Big(reward_amount).div(10 ** decimals), 6, true);
    return [_a];
  }, [pool]);

  return (
    <CannonCoinsContext.Provider
      value={{
        isDetail: !!params?.poolId,
        pool,
        poolAmount,
        coinsRef,
        winnerBidList,
        taskId,
        flipStatus: btcDetailStore.flipStatus,
        showDetail,
        setShowDetail,
        setTaskId,
        setFlipStatus: (status: number) => {
          btcDetailStore.set({ flipStatus: status });
        },
        bids: btcDetailStore.bids,
        setBids: (bids: number) => {
          btcDetailStore.set({ bids });
        },
        setSelectedMarket: (market: any) => {
          setPool(market);
          loopUpdatePool(market);
        },
        flipComplete: (index: number, addNumber: boolean, notAuto = false) => {
          if (addNumber) flipedNumberRef.current++;

          if (
            !notAuto &&
            btcDetailStore.bidResult?.is_winner &&
            btcDetailStore.bids > 10 &&
            index >= (btcDetailStore.bids === 50 ? 20 : 30)
          ) {
            setTimeout(() => {
              btcDetailStore.set({ flipStatus: 5.5 });
            }, 600);
          } else if (flipedNumberRef.current === btcDetailStore.bids) {
            flipedNumberRef.current = 0;

            if (!btcDetailStore.bidResult?.is_winner) {
              btcDetailStore.set({
                flipStatus: btcDetailStore.flipStatus !== 6 ? 6 : 0
              });
            } else {
              for (let i = 0; i < btcDetailStore.bids; i++) {
                coinsRef.current[i].collect();
              }
              setTimeout(() => {
                btcDetailStore.set({ flipStatus: 6 });
              }, 600);
            }
            return;
          }

          if (
            btcDetailStore.flipStatus >= 5 &&
            flipedNumberRef.current < btcDetailStore.bids &&
            !notAuto
          ) {
            coinsRef.current[index + 1]?.flip();
          }
        },
        onReset: (isFail = false) => {
          flipedNumberRef.current = 0;
          btcDetailStore.set({ bidResult: null });
          onQueryUserInfo();
          for (let i = 0; i < btcDetailStore.bids; i++) {
            if (isFail) coinsRef.current[i]?.revert();
            else coinsRef.current[i]?.flip(true);
          }
        },
        onReplay: () => {
          flipedNumberRef.current = 0;
          for (let i = 0; i < btcDetailStore.bids; i++) {
            coinsRef.current[i]?.flip(true);
          }
          btcDetailStore.set({ flipStatus: 5 });
        },
        getPoolRecommend,
        mobileMarketsOpen,
        setMobileMarketsOpen,
        onMobileMarketsClose,
        filterVolume,
        setFilterVolume
      }}
    >
      {children}
    </CannonCoinsContext.Provider>
  );
};

export const useBtcContext = () => {
  return useContext(CannonCoinsContext);
};
