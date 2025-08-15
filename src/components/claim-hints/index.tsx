import { useAuth } from "@/contexts/auth";
import { useEffect, useImperativeHandle, useState, useMemo } from "react";
import useClaimPenalty from "@/hooks/evm/use-claim-rewards";
import Loading from "../icons/loading";

export default function ClaimHints({ ref }: { ref: any }) {
  const { userInfo } = useAuth();
  const [cancelPools, setCancelPools] = useState<any>([{ a: 1 }]);

  const { claim, claiming } = useClaimPenalty(() => {
    cancelPools.shift();
    setCancelPools(JSON.parse(JSON.stringify(cancelPools)));
  });

  useImperativeHandle(
    ref,
    () => ({
      show: !!cancelPools.length
    }),
    [cancelPools]
  );
  useEffect(() => {
    setCancelPools(userInfo?.cancel_pool || []);
  }, [userInfo]);

  const currentPool = useMemo(() => cancelPools?.[0] || {}, [cancelPools]);

  return (
    !!cancelPools?.length && (
      <div className="w-[1440px] h-[34px] bg-[#FFC42F] flex justify-center  items-center gap-[12px] text-[14px] text-black font-medium">
        <span>
          #{currentPool?.pool_id} has been cancelled, your bid and damages is
          refunded!
        </span>
        <button
          className="button w-[70px] h-[24px] border border-black bg-white rounded-[6px]"
          onClick={() => {
            if (currentPool?.pool_id) claim(currentPool.pool_id);
          }}
        >
          {claiming ? <Loading size={12} /> : "Claim"}
        </button>
      </div>
    )
  );
}
