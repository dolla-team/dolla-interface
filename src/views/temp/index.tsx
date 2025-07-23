import React from "react";
import useTransfer from "@/hooks/solana/use-transfer";
import { QUOTE_TOKEN } from "@/config/btc";
import Winner from "@/views/btc/components/result/winner";
// GsJ6qBRNPcdSuAivJ2BQQmbWsEmDSQ8vYajfxUQqnBDj
const TempPage: React.FC = () => {
  const { onTransfer } = useTransfer({
    token: QUOTE_TOKEN,
    isTicket: false
  });

  return (
    <div className="relative">
      <button
        className="bg-white text-black button"
        onClick={() =>
          onTransfer(1, "GsJ6qBRNPcdSuAivJ2BQQmbWsEmDSQ8vYajfxUQqnBDj")
        }
      >
        Transfer
      </button>
      {/* <Winner points={1000} onClose={() => {}} /> */}
    </div>
  );
};

export default TempPage;
