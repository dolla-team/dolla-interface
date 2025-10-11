import Avatar from "@/components/avatar";
import MultipleBg from "./multiple-bg";
import { formatNumber } from "@/utils/format/number";
import { formatAddress } from "@/utils/format/address";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

export default function MWinnerCard({
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
          className="text-center"
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
        >
          <div className="h-[46px] rounded-[23px] border-[#FFE9B2] bg-[#FFFFFF1A] backdrop-blur-[10px] inline-flex items-center p-[6px] mt-[18px]">
            <div className="relative w-[32px] h-[32px] rounded-full">
              <Avatar
                size={32}
                address={data?.user_info?.user}
                email={data?.user_info?.show_email}
                src={data?.user_info?.icon}
                className="rounded-full text-[16px]"
              />
              {multiple && (
                <div className="absolute top-[-18px] right-[-18px] w-[34px] h-[38px]">
                  <div className="text-black relative z-[2] rotate-[15deg] px-[6px] flex flex-wrap items-center justify-center w-full h-full  font-[DelaGothicOne]">
                    <span className="font-bold text-[10px]">
                      {multiple
                        ? formatNumber(multiple, 0, true, { isShort: true })
                        : 0}{" "}
                    </span>
                    <span
                      className={clsx(
                        "text-[8px]",
                        multiple > 99 ? "mt-[-20px]" : "mt-[2px]"
                      )}
                    >
                      X
                    </span>
                  </div>
                  <MultipleBg size={34} />
                </div>
              )}
            </div>
            <div className="text-[14px] text-white ml-[20px]">
              {data?.pool_info?.winner_user_email ||
                formatAddress(data?.pool_info?.winner_user)}{" "}
              just won
            </div>
            <div className="text-[20px] text-[#FFEF43] ml-[5px]">
              {amount} {rewardInfo.symbol?.toUpperCase()}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
