import { formatNumber } from "@/utils/format/number";
import { QUOTE_TOKEN } from "@/config/btc";

export default function CashierEntry({
  onClick,
  tokenBalance
}: {
  onClick: (e: any) => void;
  tokenBalance: string;
}) {
  return (
    <div
      onClick={onClick}
      className="w-[192px] absolute bottom-[18px] px-[20px] left-0 flex items-center justify-between gap-1 cursor-pointer"
    >
      <div className="flex items-center gap-[8px]">
        <img src={QUOTE_TOKEN.icon} className="w-[24px] h-[24px]" />

        <div className="text-white text-[16px]">
          <span>${formatNumber(tokenBalance || "0", 2, true)}</span>
        </div>
      </div>

      <svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="tips-cashier-entry"
      >
        <circle cx="12.1436" cy="12" r="12" fill="#fff" />
        <path
          d="M11.2261 16.616V12.968H7.62615V10.232H11.2261V6.584H14.0581V10.232H17.6581V12.968H14.0581V16.616H11.2261Z"
          fill="black"
        />
      </svg>
    </div>
  );
}
