import Button from "@/components/button";
import { formatNumber } from "@/utils/format/number";
import useClaim from "@/hooks/use-claim";
import { useAuth } from "@/contexts/auth";

export default function ProfitClaim({ profit }: { profit: number }) {
  const { onQueryUserInfo } = useAuth();
  const { onClaim, claiming } = useClaim();
  
  const handleClaim = () => {
    onClaim();
    onQueryUserInfo();
  };

  return (
    <>
      <div className="text-[#57FF70] text-[20px] font-medium">
        {formatNumber(profit, 0, true, {
          prefix: "$"
        })}
      </div>
      {Number(profit) > 0 && (
        <Button
          className="w-[52px] h-[26px] text-[12px] ml-[6px]"
          loading={claiming}
          onClick={() => {
            if (!claiming) handleClaim();
          }}
        >
          Claim
        </Button>
      )}
    </>
  );
}