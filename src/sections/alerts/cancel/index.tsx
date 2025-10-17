import Button from "@/components/button";
import { formatNumber } from "@/utils/format/number";
import { motion } from "framer-motion";
import useCancelledPools from "./use-cancelled-pools";
import usePlayerRefund from "@/hooks/near/use-player-refund";

export default function CancelAlert() {
  const { currentPool } = useCancelledPools();
  const { loading: claiming, refund: onClaim } = usePlayerRefund(
    currentPool?.pool_id,
    () => {}
  );
  return (
    currentPool && (
      <motion.div
        initial={{ x: 300, opacity: 0 }} // Slide in from right
        animate={{ x: 0, opacity: 1 }} // Animate to center
        exit={{ x: 300, opacity: 0 }} // Slide out to right
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-[250px] h-[116px] bg-white rounded-[12px] py-[10px] px-[15px] border border-[#D9D9D9] shadow-[0_0_10px_0_rgba(0,0,0,0.10)]"
      >
        <div className="text-[14px] font-[500] text-black">
          #{currentPool.pool_id} Market Refund
        </div>
        <div className="text-[10px] text-black h-[40px] mt-[4px]">
          You Participated Markets #235 has been cancelled, claim your bid fund.
        </div>
        <div className={"flex items-center justify-between"}>
          <div className="text-[12px] text-black">Refund:</div>
          <div className="flex items-center gap-[10px]">
            <div className="text-[14px] font-[600] text-black">
              ${formatNumber(currentPool.purchase_usd || 0, 2, true)}
            </div>
            <Button
              onClick={() => {
                if (claiming) return;
                onClaim();
              }}
              className="!bg-[#000] !text-white w-[78px] h-[32px] !rounded-[8px]"
              loading={claiming}
            >
              Claim
            </Button>
          </div>
        </div>
      </motion.div>
    )
  );
}
