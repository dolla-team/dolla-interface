import { formatNumber } from "@/utils/format/number";
import Avatar from "@/components/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { formatAddress } from "@/utils/format/address";
import MultipleBg from "./multiple-bg";
import clsx from "clsx";
import { getAnchorPrice } from "@/utils/pool";

export default function WinnerCard({
  data,
  amount,
  rewardInfo,
  multiple
}: {
  data: any;
  amount: string;
  rewardInfo: any;
  multiple: any;
}) {
  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ x: -300, opacity: 0 }} // Slide in from right
          animate={{ x: 0, opacity: 1 }} // Animate to center
          exit={{ x: -300, opacity: 0 }} // Slide out to right
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-[190px] h-[188px] relative rounded-[10px] bg-linear-to-t from-[#614D2D] to-[#C79E5C] p-[1px]"
        >
          <div className="w-full h-full rounded-[12px] bg-[radial-gradient(169.33%_41.18%_at_50%_95.53%,_#715B47_0%,_#0A070B_100%)] shadow-[0px_0px_30px_0px_#00000030]">
            <div className="relative z-[2] flex flex-col items-center pt-[16px]">
              <div className="w-[76px] h-[76px] rounded-full flex items-center justify-center border-[1px] border-[#DD9000] bg-[linear-gradient(180deg,_#FFC93F_0%,_#FFDC84_50%,_#DEAF37_100%)] shadow-[0px_0px_30px_6px_rgba(250,252,129,0.30)]">
                <Avatar
                  size={58}
                  address={data?.user_info?.user}
                  email={data?.user_info?.email}
                  className="rounded-full border-[1px] border-[#DD9000]"
                />
              </div>
              <div
                className="text-white text-shadow-[0px_0px_10px_rgba(255,213,105,0.50)] text-[12px] font-[DelaGothicOne] mt-[-14px]"
                style={{
                  WebkitTextStroke: "1px #EEAF0F"
                }}
              >
                Last Winner
              </div>
              <div className="text-[12px] text-white font-[DelaGothicOne]">
                {data.pool_info?.winner_user_email ||
                  formatAddress(data.pool_info.winner_user)}
              </div>
              <div className="text-[10px] mt-[4px] px-[20px] w-full">
                <div className="flex items-center justify-between mt-[4px]">
                  <div className="text-[#8C8B8B]">Won</div>
                  <div className="text-white truncate">
                    {amount} {rewardInfo.symbol?.toUpperCase()}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-[4px]">
                  <div className="text-[#8C8B8B]">Valued</div>
                  <div className="text-white truncate">
                    ${formatNumber(getAnchorPrice(data?.anchor_price), 2, true)}{" "}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-[4px]">
                  <div className="text-[#8C8B8B]">Cost</div>
                  <div className="text-white truncate">
                    ${formatNumber(data?.times, 2, true)}{" "}
                  </div>
                </div>
              </div>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="188"
              viewBox="0 0 191 118"
              fill="none"
              className="absolute top-[1px] left-[1px]"
            >
              <foreignObject x="-20" y="-20" width="231" height="158">
                <div
                  style={{
                    backdropFilter: "blur(10px)",
                    clipPath: "url(#bgblur_0_2076_5263_clip_path)",
                    height: "100%",
                    width: "100%"
                  }}
                ></div>
              </foreignObject>
              <path
                opacity="0.5"
                d="M0 10C0 4.47716 4.47715 0 10 0H181C186.523 0 191 4.47715 191 10V99.6692C191 101.174 190.627 102.654 189.484 103.632C184.678 107.745 165.661 118 95.5 118C25.339 118 6.3219 107.745 1.51646 103.633C0.372865 102.654 0 101.174 0 99.6692V10Z"
                fill="#FFC42F"
                fillOpacity="0.25"
              />
              <defs>
                <clipPath
                  id="bgblur_0_2076_5263_clip_path"
                  transform="translate(20 20)"
                >
                  <path d="M0 10C0 4.47716 4.47715 0 10 0H181C186.523 0 191 4.47715 191 10V99.6692C191 101.174 190.627 102.654 189.484 103.632C184.678 107.745 165.661 118 95.5 118C25.339 118 6.3219 107.745 1.51646 103.633C0.372865 102.654 0 101.174 0 99.6692V10Z" />
                </clipPath>
              </defs>
            </svg>
          </div>

          {multiple && (
            <div className="absolute top-[-14px] right-[-14px] w-[61px] h-[63px]">
              <div className="text-black relative z-[2] px-[6px] rotate-[15deg] flex flex-wrap items-center justify-center w-full h-full  font-[DelaGothicOne]">
                <span className="font-bold text-[20px]">
                  {multiple
                    ? formatNumber(multiple, 0, true, { isShort: true })
                    : 0}{" "}
                </span>
                <span
                  className={clsx(
                    "text-[12px]",
                    multiple > 99 ? "mt-[-24px]" : "mt-[8px]"
                  )}
                >
                  X
                </span>
              </div>
              <MultipleBg size={61} />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
