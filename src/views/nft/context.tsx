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

export const CannonCoinsContext = createContext<any>({});

export const CannonCoinsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [flipStatus, setFlipStatus] = useState(0); // 0: not flipping, 1: bidding, 2: bid success
  const [bids, setBids] = useState(1);
  const coinsRef = useRef<any>({});
  const flipedNumberRef = useRef(0);
  const [bidResult, setBidResult] = useState<any>(null);
  const params = useParams();
  const { onQueryPoolInfo } = usePoolInfo("solana");
  const [pool, setPool] = useState<any>(null);
  const { data, getPoolRecommend } = usePoolRecommend(0, !params?.poolId);
  const poolCachedRef = useRef<any>(null);

  useEffect(() => {
    if (flipStatus === 0) {
      window.howl.bgm.fade(0.1, 0.2, 1000);
    }

    if (flipStatus === 1 || flipStatus === 0) {
      flipedNumberRef.current = 0;
    }

    if (flipStatus === 2) {
      setTimeout(() => {
        setFlipStatus(3);
      }, 600);
    }

    if (flipStatus === 4) {
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
        loopUpdatePool(res);
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
    const _a = formatNumber(Big(reward_amount).div(10 ** decimals), 3, true);
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
        coinsRef,
        setBids: (bids: number) => {
          if (flipStatus !== 0) return;
          setBids(bids);
        },
        setFlipStatus,
        bidResult,
        setBidResult,
        getPoolRecommend
      }}
    >
      {children}
    </CannonCoinsContext.Provider>
  );
};

export const useNftContext = () => {
  return useContext(CannonCoinsContext);
};
