import { useEffect, useState } from "react";
import axiosInstance from "@/libs/axios";
import { formatAddress } from "@/utils/format/address";
import { useBtcContext } from "../../context";

export default function BidHints({ taskId }: { taskId: string }) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [txHash, setTxHash] = useState("");
  const { flipStatus } = useBtcContext();

  useEffect(() => {
    if (!taskId) {
      setStep(0);
      return;
    }
    const fetchBidHints = async () => {
      clearTimeout(window.bidHintsTimer);
      const res = await axiosInstance.get(
        `/api/v1/user/bid/schedule?id=${taskId}`
      );
      const _step = res.data.data?.schedule;
      if (_step) {
        setStep(_step);
        setTxHash(res.data.data?.hash);
      }
      if (_step < 5) {
        window.bidHintsTimer = setTimeout(() => {
          fetchBidHints();
        }, 1000);
      } else {
        clearTimeout(window.bidHintsTimer);
      }
    };
    fetchBidHints();
    return () => clearInterval(window.bidHintsTimer);
  }, [taskId]);

  useEffect(() => {
    if (flipStatus === 0) {
      setStep(0);
      clearTimeout(window.bidHintsTimer);
    }
  }, [flipStatus]);

  // Trigger slide-up animation when step changes
  useEffect(() => {
    if (step > 0) {
      // Reset visibility to trigger animation
      setIsVisible(false);
      // Use requestAnimationFrame to ensure DOM update before animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    }
  }, [step]);

  const primaryText =
    step === 1
      ? "[🪙 Your bid has been locked]"
      : step === 2
      ? "[⚙️ Secure module signing]"
      : step === 3
      ? "[🌐 Broadcast to blockchain]"
      : step === 4
      ? "[📊 Reading on-chain result]"
      : step === 5
      ? "[✅ Bid settled! Result recorded]"
      : "";

  const secondaryText =
    step === 1
      ? `Bid #${taskId}`
      : step === 2
      ? "TEE is generating your signature"
      : step === 3
      ? txHash
        ? `txHash: ${formatAddress(txHash, 6)}`
        : ""
      : "";

  return (
    step > 0 && (
      <div
        key={step}
        className={`absolute z-[50] top-0 left-1/2 -translate-x-1/2 flex flex-col justify-center items-center w-[516px] h-[72px] rounded-[16px] border border-[#605D55] bg-[#FFFFFF1A] backdrop-blur-[25px] transition-all duration-[400ms] ease-out ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-[20px] opacity-0"
        }`}
      >
        <div className="text-[18px] font-[500] text-[#FFC42F]">
          {primaryText}
        </div>
        <div className="text-[16px] font-[400] text-[#DCDCDC]">
          {secondaryText}
        </div>
      </div>
    )
  );
}
