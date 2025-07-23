import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import usePoolRecommend from "@/hooks/use-pool-recommend";
import useBasicInfo from "@/hooks/solana/use-basic";
import { useParams } from "react-router-dom";
import usePoolInfo from "@/hooks/use-pool-info";

export const CannonCoinsContext = createContext<any>({});

export const CannonCoinsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [flipStatus, setFlipStatus] = useState(0); // 0: not flipping, 1: bidding, 2: bid success, 3: waiting, 4: bid complete, 5: auto flipping, 6: complete
  const [bids, setBids] = useState(1);
  const { sbProgramRef } = useBasicInfo();
  const coinsRef = useRef<any>({});
  const flipedNumberRef = useRef(0);
  const [bidResult, setBidResult] = useState<any>(null);
  const params = useParams();
  const { onQueryPoolInfo } = usePoolInfo("solana");
  const [pool, setPool] = useState<any>(null);

  const { data, getPoolRecommend } = usePoolRecommend(0, !params?.poolId);

  useEffect(() => {
    if (flipStatus === 1 || flipStatus === 0) {
      flipedNumberRef.current = 0;
    }
    if (flipStatus === 2) {
      for (let i = 0; i < bids; i++) {
        coinsRef.current[i].collect();
      }
      setTimeout(() => {
        setFlipStatus(3);
      }, 600);
    }

    if (flipStatus === 4) {
      for (let i = 0; i < bids; i++) {
        coinsRef.current[i].revert();
      }
    }

    if (flipStatus === 5) {
      coinsRef.current[0].flip();
    }
  }, [flipStatus]);

  const loopUpdatePool = async (_pool: any) => {
    if (_pool?.status === 1) {
      const res = await onQueryPoolInfo(_pool?.pool_id);
      if (res) setPool(res);
      window.poolTimer = setTimeout(loopUpdatePool, 10000);
    } else {
      clearTimeout(window.poolTimer);
    }
  };

  useEffect(() => {
    if (!params?.poolId) return;
    const updatePool = async () => {
      const res = await onQueryPoolInfo(Number(params.poolId));
      if (res) {
        setPool(res);
        loopUpdatePool(res);
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

  return (
    <CannonCoinsContext.Provider
      value={{
        isDetail: !!params?.poolId,
        flipStatus,
        pool,
        sbProgramRef,
        bids,
        setBids,
        setFlipStatus,
        coinsRef,
        bidResult,
        setSelectedMarket: setPool,
        setBidResult,
        flipComplete: (index: number, addNumber: boolean, notAuto = false) => {
          if (addNumber) flipedNumberRef.current++;

          if (flipedNumberRef.current === bids) {
            setFlipStatus(flipStatus !== 6 ? 6 : 0);
            flipedNumberRef.current = 0;
            return;
          }
          if (flipStatus === 5 && flipedNumberRef.current < bids && !notAuto) {
            coinsRef.current[index + 1].flip();
          }
        },
        onReset: () => {
          flipedNumberRef.current = 0;
          for (let i = 0; i < bids; i++) {
            coinsRef.current[i].flip(true);
          }
        },
        getPoolRecommend
      }}
    >
      {children}
    </CannonCoinsContext.Provider>
  );
};

export const useBtcContext = () => {
  return useContext(CannonCoinsContext);
};
