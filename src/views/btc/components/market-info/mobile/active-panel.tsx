import clsx from "clsx";
import MSellerInfo from "./m-seller-info";
import { PlayerIcon, BidsIcon } from "../icons";
import Progress from "../progress";
import RollingDigitDisplay from "@/components/rolling-digit";

export default function ActivePanel({ pool }: { pool: any }) {
  return (
    <>
      <MSellerInfo pool={pool} />
      <div className="h-[68px] px-[10px] mt-[10px] rounded-[8px] border border-[#847A67] bg-[#FFFFFF1A] backdrop-blur-[25px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <div
              className={clsx(
                "text-[16px] flex items-center gap-[6px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              <PlayerIcon />
            </div>
            <div
              className={clsx(
                "font-[DelaGothicOne] text-[26px] bg-clip-text",
                pool?.status === 3
                  ? "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)]"
                  : "bg-[linear-gradient(180deg,#FFF698_0%,#FFC42F_100%)]"
              )}
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              {pool?.participants || "-"}
            </div>
          </div>
          <div className="flex items-center gap-[8px]">
            <div
              className={clsx(
                "text-[16px] flex items-center gap-[6px]",
                pool?.status === 3 ? "text-[#C3C3C3]" : "text-[#FFE9B2]"
              )}
            >
              <BidsIcon />
            </div>
            <div
              className={clsx(
                "font-[DelaGothicOne] text-[26px] bg-clip-text",
                pool?.status === 3
                  ? "bg-[linear-gradient(180deg,#C3C3C3_0%,#787878_100%)]"
                  : "bg-[linear-gradient(180deg,#FFF698_0%,#FFC42F_100%)]"
              )}
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              <RollingDigitDisplay
                prefixSymbol="$"
                value={String(pool?.accumulative_bids || 0)}
              />
            </div>
          </div>
        </div>
        <div className="mt-[4px]">
          <Progress data={pool} />
        </div>
      </div>
    </>
  );
}
