import useIsMobile from "@/hooks/use-is-mobile";

import clsx from "clsx";

export default function Cancel({ data }: { data: any }) {
  const isMobile = useIsMobile();

  return (
    <div
      className={clsx(
        "rounded-[20px] border border-[#605D55] flex flex-col items-center justify-center",
        isMobile
          ? "w-[calc(100%-24px)] h-[254px] ml-[12px] mt-[12px] bg-[#000]/50"
          : "w-[403px] h-[224px] bg-[rgba(0,0,0,0.5)] backdrop-blur-[25px]"
      )}
    >
      <div className="text-white text-[16px] font-[DelaGothicOne]">
        This market has been {data?.status === 3 ? "cancelled" : "paused"}
      </div>
      {data?.status === 3 && (
        <div className="text-white text-[16px] mt-[40px]">
          The amount of bid has been refunded
        </div>
      )}
    </div>
  );
}
