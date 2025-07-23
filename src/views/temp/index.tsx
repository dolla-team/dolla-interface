import React from "react";
import useTransfer from "@/hooks/solana/use-transfer";
import { QUOTE_TOKEN } from "@/config/btc";
import Winner from "@/views/btc/components/result/winner";

const TempPage: React.FC = () => {
  const { onTransfer } = useTransfer({
    token: QUOTE_TOKEN,
    isTicket: true
  });

  return (
    <div className="relative">
      <button
        className="bg-white text-black button"
        onClick={() =>
          onTransfer(1, "37oSVMX9FKMyCK7zpMUKxmdJECGrYqYKcBEbs5M4fT9L")
        }
      >
        Transfer
      </button>
      {/* <Winner points={1000} onClose={() => {}} /> */}
    </div>
  );
};

export default TempPage;
