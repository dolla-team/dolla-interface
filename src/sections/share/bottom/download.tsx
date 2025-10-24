import { BASE_TOKEN } from "@/config/btc";
import { QRCodeSVG } from "qrcode.react";
import { useGlobalStore } from "@/stores/use-global";
import clsx from "clsx";

export default function Bottom({
  className,
  titleColor = "text-white",
  textClassName,
  textColor = "text-[#8A87AA]"
}: {
  className?: string;
  titleColor?: string;
  textColor?: string;
  textClassName?: string;
}) {
  const globalStore = useGlobalStore();

  return (
    <div
      className={clsx("flex justify-between items-end mt-[10px]", className)}
    >
      <div className="border-t border-[#FFFFFF33] pt-[20px]">
        <div className={clsx("text-[12px] font-[500]", titleColor)}>
          Bid for {BASE_TOKEN.symbol} now!{" "}
        </div>
        <div
          className={clsx(
            "text-[12px] mt-[6px] font-[300]",
            textClassName,
            textColor
          )}
        >
          Join Dolla by using{" "}
          <span className={clsx("font-[600]", textColor)}>oxdolla</span> Invite
          code
        </div>
      </div>
      <div className="w-[54px] h-[54px] rounded-[6px] bg-white p-[4px]">
        <QRCodeSVG
          value={`${window.location.origin}?code=${globalStore.code}`}
          size={46}
          level="H"
        />
      </div>
    </div>
  );
}
