import Button from "@/components/button/v2";
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
          "mt-[24px] p-[12px] rounded-[10px] bg-[#1A1E24] border border-[#383F47] w-full",
          tokenPanelClassName
        )}
      >
        <div className="flex items-center text-white">
          <div className="flex items-center gap-[14px]">
            <div className="w-[32px] h-[32px] rounded-full relative">
              <img
                src={config.purchaseToken.icon}
                className="w-full h-full object-cover"
              />
              <img
                src="/chains/bera-1.png"
                className="w-[16px] h-[16px] absolute bottom-[-4px] right-[-4px]"
              />
            </div>
            <div>
              <div>
                <span className="text-[16px] text-white">
                  {config.purchaseToken.symbol}{" "}
                </span>
              </div>
              <div className="text-[12px] text-white">Berachain</div>
            </div>
          </div>
        </div>
        <div className="mt-[12px]">
          <span className="text-[#8A87AA] text-[12px] break-all leading-[18px]">
            {address}
          </span>
        </div>
        <Button
          className="w-[95%] mx-auto h-[50px] mt-[10px] flex items-center gap-[10px]"
          onClick={() => {
            onCopy(address);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="16"
            viewBox="0 0 15 16"
            fill="none"
          >
            <path
              d="M9.07422 3.44043C9.40085 3.44002 9.72451 3.50316 10.0264 3.62793C10.3283 3.75275 10.603 3.936 10.834 4.16699C11.065 4.398 11.2482 4.67271 11.373 4.97461C11.4978 5.27647 11.5619 5.60012 11.5615 5.92676V12.54C11.5878 13.9162 10.4505 15.0283 9.07422 15.0283H2.4873C2.16078 15.0287 1.83693 14.9645 1.53516 14.8398C1.23331 14.715 0.958519 14.5317 0.727539 14.3008C0.496526 14.0698 0.313308 13.7951 0.188477 13.4932C0.0636773 13.1913 -0.000414454 12.8677 0 12.541V5.92773C-0.000541289 5.60102 0.0637444 5.27755 0.188477 4.97559C0.313246 4.67356 0.496512 4.39909 0.727539 4.16797C0.95844 3.93701 1.23241 3.75378 1.53418 3.62891C1.83616 3.50401 2.16052 3.44001 2.4873 3.44043H9.07422ZM2.4873 5.02734C2.36891 5.02636 2.25117 5.04891 2.1416 5.09375C2.0321 5.13858 1.93232 5.20445 1.84863 5.28809C1.76492 5.37179 1.69818 5.4715 1.65332 5.58105C1.60846 5.69064 1.58594 5.80835 1.58691 5.92676V12.54C1.58593 12.6585 1.60846 12.7762 1.65332 12.8857C1.69819 12.9953 1.76491 13.095 1.84863 13.1787C1.93233 13.2624 2.03209 13.3282 2.1416 13.373C2.25118 13.4179 2.3689 13.4404 2.4873 13.4395H9.07422C9.19263 13.4404 9.31033 13.4179 9.41992 13.373C9.5294 13.3282 9.62923 13.2624 9.71289 13.1787C9.79655 13.095 9.86237 12.9952 9.90723 12.8857C9.95209 12.7762 9.97461 12.6585 9.97363 12.54V5.92676C9.97461 5.80835 9.95209 5.69064 9.90723 5.58105C9.86236 5.47158 9.79655 5.37174 9.71289 5.28809C9.62923 5.20443 9.5294 5.13861 9.41992 5.09375C9.31033 5.04889 9.19263 5.02637 9.07422 5.02734H2.4873ZM12.5938 0C13.2177 0.00146688 13.8156 0.250214 14.2568 0.691406C14.6981 1.13261 14.9468 1.73054 14.9482 2.35449V9.23242C14.9469 9.85636 14.698 10.4543 14.2568 10.8955C13.8156 11.3367 13.2177 11.5854 12.5938 11.5869C12.3833 11.5869 12.1811 11.5033 12.0322 11.3545C11.8836 11.2058 11.7999 11.0042 11.7998 10.7939C11.7998 10.5835 11.8834 10.3812 12.0322 10.2324C12.1811 10.0836 12.3833 10 12.5938 10C12.797 9.99992 12.9919 9.91906 13.1357 9.77539C13.2797 9.63148 13.3604 9.43594 13.3604 9.23242V2.35449C13.3603 2.15107 13.2796 1.95635 13.1357 1.8125C12.9919 1.66866 12.7972 1.587 12.5938 1.58691H5.71582C5.5123 1.58691 5.31676 1.66859 5.17285 1.8125C5.02908 1.95634 4.9483 2.15112 4.94824 2.35449C4.94824 2.56493 4.8646 2.76719 4.71582 2.91602C4.56699 3.06484 4.36478 3.14844 4.1543 3.14844C3.94383 3.14842 3.74159 3.06483 3.59277 2.91602C3.44402 2.7672 3.36035 2.5649 3.36035 2.35449C3.3618 1.73059 3.6106 1.1326 4.05176 0.691406C4.49304 0.250142 5.09176 0.00138645 5.71582 0H12.5938Z"
              fill="white"
            />
          </svg>
          <span className="text-[14px] text-white">Copy Deposit Address</span>
        </Button>
      </div>
    </div>
  );
}
