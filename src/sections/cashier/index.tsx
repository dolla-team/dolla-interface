import clsx from "clsx";
import Coin from "@/components/icons/coin";
import Button from "@/components/button";
import QuickPopup from "./quick-popup";
import CashierModal from "./modal";
import { useRef, useState } from "react";
import useTokenBalance from "@/hooks/use-token-balance";
import { PURCHASE_TOKEN } from "@/config";
import { formatNumber } from "@/utils/format/number";

export default function Cashier({ className }: any) {
  const quickPopupRef = useRef<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Mock token balance for NEAR integration
  const tokenBalance = "0";

  return (
    <div className={clsx("flex items-center gap-[13px]", className)}>
      <div className="h-[40px] rounded-[6px] bg-[#222A35] flex items-center p-[10px]">
        <Coin />
        <span className="text-[16px] font-medium min-w-[76px] text-white ml-[5px]">
          {formatNumber(tokenBalance, 0, true)}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            quickPopupRef.current?.show();
          }}
          className="button w-[24px] h-[24px] rounded-[4px] bg-[#3B4656] flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
          >
            <path
              d="M7.49119 4.80036H4.79982V7.46702C4.79982 7.76163 4.56148 8 4.2669 8H3.73399C3.43941 8 3.20018 7.76163 3.20018 7.46702V4.80036H0.508815C0.227628 4.80036 0 4.5727 0 4.29149V3.70851C0 3.4273 0.227628 3.19964 0.508815 3.19964H3.20018V0.532976C3.20018 0.238366 3.43941 0 3.73399 0H4.2669C4.56148 0 4.79982 0.239259 4.79982 0.532976V3.19964H7.49119C7.77237 3.19964 8 3.4273 8 3.70851V4.29149C8 4.57181 7.77237 4.80036 7.49119 4.80036Z"
              fill="#FFC42F"
            />
          </svg>
        </button>
      </div>
      <Button
        className="w-[84px] h-[40px]"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Cashier
      </Button>
      <QuickPopup ref={quickPopupRef} />
      <CashierModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}