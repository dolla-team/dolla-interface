import PointIcon from "@/components/icons/point-icon";
import useUserInfoStore from "@/stores/use-user-info";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import RedeemSelection from "./redeem-selection";
import clsx from "clsx";
import { useConfigStore } from "@/stores/use-config";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";
import useIsMobile from "@/hooks/use-is-mobile";

export default function Points({ className }: { className?: string }) {
  const { prize } = useUserInfoStore();

  const { config } = useConfigStore();
  const isMobile = useIsMobile();
  const [items, itemsMap, minPoints] = useMemo(() => {
    if (!config?.point_withdrawal_config) return [[], {}, 0];
    let _itemsMap: any = {};
    let min = 0;
    const _items = config.point_withdrawal_config.map((item: any) => {
      let icon = "";
      let name = "";

      if (item.token.toLowerCase() === BASE_TOKEN.address.toLowerCase()) {
        icon = BASE_TOKEN.pointsIcon;
        name = BASE_TOKEN.name;
      } else if (
        item.token.toLowerCase() === QUOTE_TOKEN.address.toLowerCase()
      ) {
        icon =
          item.token_volume === "1"
            ? "/points/bid.png"
            : QUOTE_TOKEN.pointsIcon;
        name = item.token_volume === "1" ? "Free Bid" : QUOTE_TOKEN.name;
      }
      _itemsMap[item.token + "_" + item.token_volume] = { name };

      if (Number(item.number) < min || min === 0) {
        min = Number(item.number);
      }

      return {
        ...item,
        icon,
        name,
        disabled: prize.points < Number(item.number)
      };
    });
    return [_items, _itemsMap, min];
  }, [config?.point_withdrawal_config, prize]);

  const progress = useMemo(() => {
    if (!minPoints) return 0;
    if (Big(prize?.points || 0).gte(minPoints)) {
      return 1;
    }
    return Math.min(
      Math.max(
        Big(prize?.points || 0)
          .div(minPoints)
          .toNumber(),
        0
      ),
      1
    );
  }, [prize, minPoints]);

  const [showRedeemSelection, setShowRedeemSelection] = useState(false);
  return (
    <>
      <div
        className={clsx(
          "flex items-center gap-[4px]",
          progress >= 1 ? "button" : "",
          isMobile &&
            "p-[4px] pr-[14px] border border-[#7C68FF] rounded-l-[40px] fixed right-[-2px] bottom-[30px] duration-300 bg-[#000]/30 scale-[0.76] origin-right",
          isMobile &&
            (prize.points > 0 ? "!translate-x-[0]" : "translate-x-[100%]"),
          className
        )}
        onClick={() => {
          if (progress >= 1) {
            setShowRedeemSelection(true);
          }
        }}
      >
        <div className="relative w-[26px] h-[26px]">
          <motion.div
            className="absolute top-0 left-0 w-full h-full border-[3px] border-[rgba(76,45,78,0.6)] rounded-full"
            animate={{
              opacity: progress >= 1 ? [1, 0, 1] : 1
            }}
            transition={{
              opacity: { duration: 2, repeat: Infinity, ease: "easeOut" }
            }}
          />
          <motion.svg
            className="absolute top-0 left-0 rotate-[-90deg]"
            width="26"
            height="26"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.circle
              cx="22"
              cy="22"
              r="20"
              stroke="url(#paint0_linear_1991_3580)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                strokeWidth: 3,
                strokeLinecap: "round"
              }}
              initial={{
                pathLength: 0,
                opacity: 0
              }}
              animate={{
                pathLength: progress,
                opacity: progress >= 1 ? [1, 0, 1] : progress > 0 ? 1 : 0
              }}
              transition={{
                pathLength: { duration: 0.5, ease: "easeOut" },
                opacity:
                  progress >= 1
                    ? { duration: 2, repeat: Infinity, ease: "easeOut" }
                    : { duration: 0.3 }
              }}
            />
            <defs>
              <linearGradient
                id="paint0_linear_1991_3580"
                x1="42"
                y1="45.0189"
                x2="2"
                y2="2"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#FFEF43" />
                <stop offset="1" stopColor="#FFC42F" />
              </linearGradient>
            </defs>
          </motion.svg>
          <PointIcon
            className="w-[20px] h-[20px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            size={20}
          />
        </div>

        <span className={clsx("text-white font-[600] text-[16px]")}>
          x
          {isMobile
            ? formatNumber(prize.points, 0, true, { isShort: false })
            : formatNumber(prize.points, 0, true)}
        </span>
      </div>
      <RedeemSelection
        showRedeemSelection={showRedeemSelection}
        onClose={() => setShowRedeemSelection(false)}
        points={prize.points}
        items={items}
        itemsMap={itemsMap}
      />
    </>
  );
}
