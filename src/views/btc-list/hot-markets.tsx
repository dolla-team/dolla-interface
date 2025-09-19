import Button from "@/components/button";
import clsx from "clsx";
import useTokenPrice from "@/hooks/use-token-price";
import { useMemo } from "react";
import { formatNumber } from "@/utils/format/number";
import useBtcStore from "@/stores/use-btc";
import { BASE_TOKEN } from "@/config/btc";
import Big from "big.js";
import { useNavigate } from "react-router-dom";

export default function MoreMarkets() {
  const { prices } = useTokenPrice(BASE_TOKEN);
  const btcStore = useBtcStore();
  const navigate = useNavigate();
  const price = useMemo(() => {
    if (!prices || prices.length === 0) return 0;

    return prices[0].last_price;
  }, [prices]);

  return (
    <div className="flex items-center gap-[20px] mt-[20px]">
      {[1, 0.1, 0.01].map((item) => {
        return (
          <MarketItem
            key={item}
            value={item}
            price={price}
            onClick={() => {
              btcStore.set({
                recommendValue: Big(item)
                  .mul(10 ** BASE_TOKEN.decimals)
                  .toString()
              });
              navigate("/btc/detail");
            }}
          />
        );
      })}
    </div>
  );
}

const MarketItem = ({
  value,
  price,
  onClick
}: {
  value: number;
  price: number;
  onClick: () => void;
}) => {
  const valued = useMemo(() => {
    return formatNumber(price * value, 1, true);
  }, [price, value]);
  return (
    <div
      className="
        w-[372px] h-[200px] 
        rounded-[16px] 
        border 
        border-[rgba(242,242,242,0.20)] 
        relative group 
        backdrop-blur-[25px]
      "
    >
      <div
        className="absolute top-0 left-0 w-full h-full rounded-[16px] z-[1] flex flex-col justify-center"
        style={{
          background:
            "radial-gradient(61.75% 61.75% at 50% 100%, rgba(255, 196, 47, 0.60) 0%, rgba(0, 0, 0, 0.00) 100%), #000"
        }}
      />
      <div
        className={clsx(
          "absolute top-0 left-0 w-full h-full rounded-[16px] z-[5] flex flex-col justify-center",
          value === 0.01 ? "pl-[90px]" : "pl-[140px]"
        )}
      >
        <div className="text-[14px] text-white">Bid for</div>
        <div
          className={`
            text-[32px] font-[500]
            bg-gradient-to-b from-[#FFC42F] to-[#FFE39C]
            bg-clip-text
            text-transparent
            [background-clip:text]
            [-webkit-background-clip:text]
            [-webkit-text-fill-color:transparent]
          `}
        >
          {value} Bitcoin
        </div>
        <div className="flex items-center gap-[4px] text-[14px]">
          <span className="text-white">Valued</span>
          <span
            className="
              bg-[linear-gradient(180deg,_#FFC42F_0%,_#FFE39C_100%)]
              bg-clip-text
              text-transparent
              [background-clip:text]
              [-webkit-background-clip:text]
              [-webkit-text-fill-color:transparent]
            "
          >
            ${valued}
          </span>
        </div>
      </div>
      <div
        className="absolute top-0 left-0 w-full h-full rounded-[16px] z-[2] bg-cover bg-center"
        style={{
          backgroundImage: `url('/home/btc-${value}.png')`
        }}
      />
      <div className="opacity-0 absolute top-0 left-0 z-[10] bg-[#0000004D] backdrop-blur-[25px] group-hover:opacity-100 duration-300 w-full h-full rounded-[16px] flex items-center justify-center">
        <Button className="w-[160px] h-[42px] !bg-[#FFC42F]" onClick={onClick}>
          Bid for {value} BTC
        </Button>
      </div>
    </div>
  );
};
