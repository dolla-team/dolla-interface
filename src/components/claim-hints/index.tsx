import { useAuth } from "@/contexts/auth";
import { useEffect, useImperativeHandle, useState, useMemo } from "react";
import useClaimPenalty from "@/hooks/use-claim-penalty";
import Loading from "../icons/loading";

export default function ClaimHints({ ref }: { ref: any }) {
  const { userInfo } = useAuth();
  const [cancelPools, setCancelPools] = useState<any>([{ a: 1 }]);

  const { onClaim, claiming } = useClaimPenalty();
  
  // Handle claim completion
  const handleClaimComplete = () => {
    cancelPools.shift();
    setCancelPools(JSON.parse(JSON.stringify(cancelPools)));
  };

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
            if (currentPool?.pool_id) {
              onClaim();
              handleClaimComplete();
            }
          }}
        >
          {claiming ? <Loading size={12} /> : "Claim"}
        </button>
      </div>
    )
  );
}