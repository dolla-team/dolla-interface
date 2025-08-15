import Button from "@/components/button";
import { QRCodeSVG } from "qrcode.react";
import useCopy from "@/hooks/use-copy";
import config from "@/config/bera";
import clsx from "clsx";

export default function Recharge({
  token,
  className,
  tokenPanelClassName
}: {
  token: any;
  className?: string;
  tokenPanelClassName?: string;
}) {
  const rechargeToken = token || config.purchaseToken;
  const address = rechargeToken.address;
  const { onCopy } = useCopy();
  return (
    <div className={clsx("flex flex-col items-center", className)}>
      <div className="w-[160px] h-[160px] mt-[10px] rounded-[6px] bg-white p-2">
        <QRCodeSVG
          value={address}
          size={144}
          level="H"
          imageSettings={{
            src: rechargeToken.icon,
            height: 24,
            width: 24,
            excavate: true
          }}
        />
      </div>
      <div
        className={clsx(
          "mt-[24px] px-[10px] py-[12px] rounded-[6px] bg-[#191E27] w-full",
          tokenPanelClassName
        )}
      >
        <div className="flex items-center text-white">
          <div className="text-[16px] font-semibold mr-[10px]">
            {rechargeToken.symbol}
          </div>
          <img
            className="w-[18px] h-[18px] rounded-[6px]"
            src="/chains/solana.png"
          />
          <div className="text-[14px] font-normal ml-[5px]">Solana</div>
        </div>
        <div className="flex items-center justify-between gap-[9px] mt-[12px]">
          <span className="text-[#BBACA6] text-[14px] shrink-1 break-all leading-[18px]">
            {address}
          </span>
          <Button
            className="w-[60px] h-[32px] shrink-0"
            onClick={() => {
              onCopy(address);
            }}
          >
            Copy
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center w-full px-[10px] mt-[20px] text-[12px] text-[#ADBCCF]">
        <span className="text-[#BBACA6]">Minimum deposit amount</span>
        <span className="text-white">
          {rechargeToken.symbol === "BTC" ? "0.001" : "1"}{" "}
          {rechargeToken.symbol}
        </span>
      </div>
      <div className="flex justify-between items-center w-full px-[10px] mt-[10px] text-[12px] text-[#ADBCCF]">
        <span className="text-[#BBACA6]">Cost time</span>
        <span className="text-white">~2 mins</span>
      </div>
    </div>
  );
}
