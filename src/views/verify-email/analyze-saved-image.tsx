import DollaEye from "@/components/dolla-eye";
import clsx from "clsx";
import ReactDOM from "react-dom";
import { useEffect, useState } from "react";

export default function SavedImage({
  imageRef,
  result,
  handle,
  predictions
}: any) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const containerElement = document.getElementById("verify-email-container");
    if (containerElement) {
      setContainer(containerElement);
    }
  }, []);

  if (!container) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      ref={imageRef}
      className="w-[1332px] h-[750px] bg-black overflow-hidden absolute top-0 left-0 z-[1]"
    >
      <div className="relative z-[2] pt-[68px] pl-[44px]">
        <DollaEye className="" height={64} />
        <div className="w-[264px] mt-[40px] text-[#767676] text-[32px] leading-[180%] tracking-[-1.92px]">
          <div className="border-b border-[#767676]">The first</div>
          <div className="border-b border-[#767676]">Trustless</div>
          <div className="border-b border-[#767676]">Probabilistic</div>
          <div className="border-b border-[#767676]">Marketplace.</div>
        </div>
      </div>
      <div
        className="absolute z-[3] top-[48px] right-[40px] w-[972px] h-[652px] p-[52px] rounded-[32px] border-[#3E300E] shadow-[0_4px_12px_0_rgba(0,0,0,0.25)_inset] backdrop-blur-[10px]"
        style={{
          background:
            "radial-gradient(51.7% 45.95% at 95.06% 0%, rgba(0, 255, 132, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), rgba(68, 68, 68, 0.80)"
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[28px]">
            {result?.profile?.user?.profileImageUrl && (
              <img
                src={result.profile.user.profileImageUrl}
                alt={result.profile.user.userName}
                className="w-[112px] h-[112px] rounded-full object-cover"
              />
            )}
            <div className="text-white leading-[120%]">
              <div className="text-[48px]">
                {result?.profile?.user?.displayName}
              </div>
              <div className="text-[32px] mt-[30px]">@{handle}</div>
            </div>
          </div>
          <div className="text-right leading-[120%]">
            <div className="text-[36px] text-white">DEI Score</div>
            <div className="text-[92px] text-[#00FF84] mt-[28px]">
              {result.finalScore || 0}
            </div>
          </div>
        </div>
        <div className="mt-[56px] flex flex-col gap-[16px]">
          {predictions?.map((prediction: any, index: number) => (
            <div
              key={index}
              className="w-[888px] h-[120px] gap-[20px] rounded-[20px] flex items-center pl-[36px]"
              style={{
                background:
                  index === 0
                    ? "radial-gradient(85.14% 31.19% at 1.58% 4.1%, rgba(92, 105, 255, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), rgba(255, 255, 255, 0.15)"
                    : index === 1
                      ? "radial-gradient(85.14% 31.19% at 1.58% 4.1%, rgba(255, 206, 82, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), rgba(255, 255, 255, 0.15)"
                      : "radial-gradient(85.14% 31.19% at 1.58% 4.1%, rgba(0, 255, 132, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), rgba(255, 255, 255, 0.15)"
              }}
            >
              <div
                className={clsx(
                  "w-[160px] text-[60px] shrink-0",
                  index === 0 && "text-[#5C69FF]",
                  index === 1 && "text-[#FFCE52]",
                  index === 2 && "text-[#00FF84]"
                )}
              >
                {prediction.probability}%
              </div>
              <div className="text-[28px] leading-[125%] text-white shrink-1 line-clamp-3">
                {prediction.prediction}
              </div>
            </div>
          ))}
        </div>
      </div>
      <img
        src="/verify/result-woman.png"
        alt="result"
        className="w-[460px] h-[320px] absolute bottom-0 left-[-40px]"
      />
      <img
        src="/verify/usdt-bg.png"
        alt="usdt"
        className="w-[134px] h-[164px] absolute bottom-[184px] left-[0px]"
      />
      <img
        src="/verify/btc-bg.png"
        alt="btc"
        className="w-[188px] h-[188px] absolute top-[100px] left-[240px]"
      />
    </div>,
    container
  );
}
