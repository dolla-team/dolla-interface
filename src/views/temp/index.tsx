import React from "react";
import useTransfer from "@/hooks/solana/use-transfer";
import { QUOTE_TOKEN } from "@/config/btc";
import Winner from "@/views/btc/components/result/winner";
import useClaimReward from "@/hooks/solana/use-claim-reward";
// GsJ6qBRNPcdSuAivJ2BQQmbWsEmDSQ8vYajfxUQqnBDj
const TempPage: React.FC = () => {
  const { onTransfer } = useTransfer({
    token: QUOTE_TOKEN,
    type: "withdraw"
  });
  const { onClaim } = useClaimReward({
    onClaimSuccess: () => {
      console.log("onClaimSuccess");
    }
  });

  return (
    <div className="relative flex gap-[10px]">
      <button
        className="bg-white text-black button px-[20px]"
        onClick={() =>
          onTransfer(1, "GsJ6qBRNPcdSuAivJ2BQQmbWsEmDSQ8vYajfxUQqnBDj")
        }
      >
        Transfer
      </button>
      <button
        className="bg-white text-black button px-[20px]"
        onClick={() => {
          onClaim(8);
        }}
      >
        Claim
      </button>
      {/* <Winner points={1000} onClose={() => {}} /> */}
    </div>
  );
};

export default TempPage;
