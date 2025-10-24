import { BASE_TOKEN } from "@/config/btc";
import { QRCodeSVG } from "qrcode.react";
import { useGlobalStore } from "@/stores/use-global";
import clsx from "clsx";
import { formatAddress } from "@/utils/format/address";
import { useAuth } from "@/contexts/auth";

export default function Bottom({
  className,
  titleColor = "text-white",
  textColor = "text-[#8A87AA]"
}: {
  className?: string;
  titleColor?: string;
  textColor?: string;
}) {
  const globalStore = useGlobalStore();
  const { userInfo } = useAuth();
  return (
    <div className={clsx("flex items-center gap-[10px] mt-[10px]", className)}>
      <div className="w-[58px] h-[58px] rounded-[6px] bg-white p-[4px]">
        <QRCodeSVG
          value={`${window.location.origin}?code=${globalStore.code}`}
          size={50}
          level="H"
        />
      </div>
      <div className="">
        <div className={clsx("text-[16px] font-[500]", titleColor)}>
          Bid for {BASE_TOKEN.symbol} now!{" "}
        </div>
        <div className="flex items-center gap-[10px] bg-[#FFFFFF29] rounded-[10px] p-[4px] mt-[4px]">
          <div className="w-[173px] h-[26px] rounded-[10px] bg-[#FFC42F] text-center leading-[26px] text-[12px] text-black">
            app.dolla.market
          </div>
          <span className="text-[#C3C3CC] text-[10px] pr-[10px]">
            {" "}
            {userInfo?.name || formatAddress(userInfo?.user)} Invite code
            <span className={clsx("text-white ml-[6px]", textColor)}>
              {globalStore.code}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
