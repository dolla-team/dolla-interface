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
export const CannonCoinsContext = createContext<any>({});

export const CannonCoinsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [flipStatus, setFlipStatus] = useState(0); // 0: not flipping, 1: bidding, 2: bid success, 3: waiting, 4: bid complete, 5: auto flipping, 6: complete
  const [bids, setBids] = useState(1);
  const [taskId, setTaskId] = useState<string>("");
  const coinsRef = useRef<any>({});
  const flipedNumberRef = useRef(0);
  const [bidResult, setBidResult] = useState<any>(null);
  const params = useParams();
  const { onQueryUserInfo } = useAuth();
  const { onQueryPoolInfo } = usePoolInfo();
  const [pool, setPool] = useState<any>(null);
  const { data, getPoolRecommend } = usePoolRecommend(0, !params?.poolId);
  const [mobileMarketsOpen, setMobileMarketsOpen] = useState(false);
  const [filterVolume, setFilterVolume] = useState(0);
  const poolCachedRef = useRef<any>(null);

  const onMobileMarketsClose = () => {
    setMobileMarketsOpen(false);
  };

  useEffect(() => {
    if (flipStatus === 0) {
      window.howl.bgm.fade(0.1, 0.2, 1000);
    }

    if (flipStatus === 1 || flipStatus === 0) {
      flipedNumberRef.current = 0;
    }

    if (flipStatus === 2) {
      for (let i = 0; i < bids; i++) {
        coinsRef.current[i]?.collect();
      }
      setTimeout(() => {
        setFlipStatus(3);
      }, 600);
    }

    if (flipStatus === 4) {
      window.howl.bgm.fade(0.2, 0, 1000);
      for (let i = 0; i < bids; i++) {
        coinsRef.current[i]?.revert();
      }
    }

    if (flipStatus === 5) {
      if (bids === 1) {
        coinsRef.current[0]?.revert();
        coinsRef.current[0]?.flip();
      } else {
        coinsRef.current[0]?.flip();
        // for (let i = 0; i < bids; i++) {
        //   coinsRef.current[i]?.flip(false, true);
        // }
      }
    }

    if (flipStatus === 6 && poolCachedRef.current) {
      if (params?.poolId) {
        setPool(poolCachedRef.current);
      }
      if (!params?.poolId && !bidResult?.bid?.is_winner) {
        clearTimeout(window.poolTimer);
        getPoolRecommend();
      }
    }
  }, [flipStatus]);

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
        flipStatus,
        pool,
        poolAmount,
        bids,
        setBids: (bids: number) => {
          setBids(bids);
        },
        setFlipStatus,
        coinsRef,
        bidResult,
        taskId,
        setTaskId,
        setSelectedMarket: (market: any) => {
          setPool(market);
          loopUpdatePool(market);
        },
        setBidResult,
        flipComplete: (index: number, addNumber: boolean, notAuto = false) => {
          if (addNumber) flipedNumberRef.current++;

          if (flipedNumberRef.current === bids) {
            flipedNumberRef.current = 0;

            if (!bidResult.bid.is_winner) {
              setFlipStatus(flipStatus !== 6 ? 6 : 0);
            } else {
              for (let i = 0; i < bids; i++) {
                coinsRef.current[i].collect();
              }
              setTimeout(() => {
                setFlipStatus(6);
              }, 600);
            }
            return;
          }

          if (flipStatus === 5 && flipedNumberRef.current < bids && !notAuto) {
            coinsRef.current[index + 1]?.flip();
          }
        },
        onReset: (isFail = false) => {
          flipedNumberRef.current = 0;
          setBidResult(null);
          onQueryUserInfo();
          for (let i = 0; i < bids; i++) {
            if (isFail) coinsRef.current[i]?.revert();
            else coinsRef.current[i]?.flip(true);
          }
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
