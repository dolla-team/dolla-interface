import { BASE_TOKEN } from "@/config/btc";
import { QRCodeSVG } from "qrcode.react";
import { useGlobalStore } from "@/stores/use-global";
import clsx from "clsx";
import { formatAddress } from "@/utils/format/address";
import { useAuth } from "@/contexts/auth";

export default function Bottom({
  className,
  titleColor = "text-white"
}: {
  className?: string;
  titleColor?: string;
}) {
  const { userInfo } = useAuth();
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
            "text-[12px] mt-[6px] pl-[6px] flex items-center gap-[6px] text-[#C1BFD5] p-[3px]",
            "h-[26px] leading-[24px] rounded-[6px] bg-[#FFFFFF29] backdrop-blur-[10px]"
          )}
        >
          <span className={clsx("max-w-[100px] truncate")}>
            {userInfo?.name || formatAddress(userInfo?.user)}
          </span>{" "}
          <span> Invite code</span>
          <div className="h-[20px] px-[6px] rounded-[6px] bg-[#FFC42F] text-center leading-[20px] text-[10px] text-black">
            {globalStore.code}
          </div>
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
