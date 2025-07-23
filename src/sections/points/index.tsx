import PointIcon from "@/components/icons/point-icon";
import useUserInfoStore from "@/stores/use-user-info";
import { addThousandSeparator } from "@/utils/format/number";
import Big from "big.js";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import RedeemSelection from "./redeem-selection";
import clsx from "clsx";
import { useConfigStore } from "@/stores/use-config";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";

export default function Points() {
  const { prize } = useUserInfoStore();
  const { config } = useConfigStore();
  const [items, itemsMap, minPoints] = useMemo(() => {
    if (!config?.point_withdrawal_config) return [[], {}, 0];
    let _itemsMap: any = {};
    let min = 0;
    const _items = config.point_withdrawal_config.map((item: any) => {
      let icon = "";
      let name = "";

      if (item.token.toLowerCase() === BASE_TOKEN.address.toLowerCase()) {
        icon = BASE_TOKEN.pointIcon;
        name = BASE_TOKEN.name;
      } else if (
        item.token.toLowerCase() === QUOTE_TOKEN.address.toLowerCase()
      ) {
        icon =
          item.token_volume === "1" ? "/points/bid.png" : QUOTE_TOKEN.pointIcon;
        name = item.token_volume === "1" ? "Free Bid" : QUOTE_TOKEN.name;
      } else if (item.token === "SOL") {
        icon = "/points/solana.png";
        name = "SOL";
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
          "flex items-center gap-[8px]",
          progress >= 1 ? "button" : ""
        )}
        onClick={() => {
          if (progress >= 1) {
            setShowRedeemSelection(true);
          }
        }}
      >
        <div className="relative w-[44px] h-[44px]">
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
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.circle
              cx="22"
              cy="22"
              r="20"
              stroke="url(#paint0_linear_1991_3580)"
              stroke-width="3"
              stroke-linecap="round"
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
                <stop stop-color="#FFEF43" />
                <stop offset="1" stop-color="#FFC42F" />
              </linearGradient>
            </defs>
          </motion.svg>
          <PointIcon
            className="w-[30px] h-[30px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            size={30}
          />
        </div>

        <span
          className="text-[#FFEF43] text-[20px] font-bold font-[AlfaSlabOne]"
          style={{
            WebkitTextStrokeWidth: "1px",
            WebkitTextStrokeColor: "#5E3737"
          }}
        >
          x{addThousandSeparator(prize.points.toString())}
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
