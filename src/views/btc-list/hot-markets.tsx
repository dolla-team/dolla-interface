import Button from "@/components/button";
import clsx from "clsx";
import useTokenPrice from "@/hooks/use-token-price";
import { useMemo } from "react";
import { formatNumber } from "@/utils/format/number";
import { AMOUNT, BASE_TOKEN } from "@/config/btc";
import { useNavigate } from "react-router-dom";
import usePoolListStore from "@/stores/use-pool-list";
import { getReAnchorPrice } from "@/utils/pool";

const imgs = ["btc-1", "btc-0.1", "btc-0.01"];

export default function MoreMarkets() {
  const { prices } = useTokenPrice(BASE_TOKEN);

  const poolListStore = usePoolListStore();
  const price = useMemo(() => {
    if (BASE_TOKEN.address === "usdt.tether-token.near") {
      return 1;
    }
    if (!prices || prices.length === 0) return 0;

    return prices[0].last_price;
  }, [prices]);

  return (
    <div className="flex items-center gap-[20px] mt-[20px]">
      {AMOUNT.map((item, index) => {
        return (
          <MarketItem
            key={item}
            value={item}
            price={price}
            market={poolListStore.hotMarkets[index]}
            img={imgs[index]}
            index={index}
          />
        );
      })}
    </div>
  );
}

const MarketItem = ({
  value,
  price,
  market,
  img,
  index
}: {
  value: number;
  price: number;
  market: any;
  img: string;
  index: number;
}) => {
  const navigate = useNavigate();
  const valued = useMemo(() => {
    if (!market) return formatNumber(price * value, 2, true);
    return formatNumber(getReAnchorPrice(market), 2, true);
  }, [price, value, market]);

  return (
    <div
      className={clsx(
        "w-[372px] h-[200px] rounded-[16px] border border-[rgba(242,242,242,0.20)] relative group backdrop-blur-[25px]"
      )}
    >
      {market && (
        <div className="absolute z-[3] top-[10px] left-[12px] w-[calc(100%-24px)] flex items-center justify-between text-[12px] text-white">
          <div className="border border-[#F2F2F233] bg-[#FFFFFF1F] px-[6px] h-[18px] rounded-[10px] flex items-center gap-[4px]">
            <ParticipantsIcon />
            <span>{market?.participants}</span>
          </div>
          <div className="border border-[#F2F2F233] bg-[#FFFFFF1F] px-[6px] h-[18px] rounded-[10px] flex items-center gap-[4px]">
            #{market?.pool_id}
          </div>
        </div>
      )}
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
          index === 2 ? "pl-[90px]" : "pl-[140px]"
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
          {value} {BASE_TOKEN.symbol}
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
          backgroundImage: `url('/home/${img}.png')`
        }}
      />
      <div className="opacity-0 absolute top-0 left-0 z-[10] bg-[#0000004D] backdrop-blur-[25px] group-hover:opacity-100 duration-300 w-full h-full rounded-[16px] flex items-center justify-center">
        <Button
          className="w-[160px] h-[42px] !bg-[#FFC42F]"
          onClick={() => {
            if (!market) {
              navigate("/btc/create");
              return;
            }
            navigate("/btc/detail/" + market.pool_id);
          }}
        >
          {market
            ? "Bid for " + value + " " + BASE_TOKEN.symbol
            : "Create Market"}
        </Button>
      </div>
    </div>
  );
};

const ParticipantsIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="13"
      viewBox="0 0 12 13"
      fill="none"
    >
      <path
        d="M6.03284 0.00244141C7.64842 0.041784 8.93643 0.532853 9.89612 1.4751C10.8556 2.41734 11.3169 3.64851 11.2799 5.16846C11.2437 6.6569 10.7228 7.84816 9.71838 8.74268C9.3114 9.10509 8.85365 9.38903 8.34631 9.59814C9.63963 10.2451 10.1616 11.3862 10.2067 12.062C10.1912 12.0718 8.72451 12.9994 6.00061 12.9995C3.26704 12.9995 1.94986 12.0655 1.94495 12.062C2.07566 11.4087 2.53688 10.3217 3.70862 9.66553C3.01174 9.41954 2.40065 9.04982 1.87756 8.55225C0.917949 7.60998 0.456569 6.39412 0.492798 4.90576C0.529867 3.3858 1.05093 2.17814 2.0553 1.28369C3.09135 0.390226 4.41739 -0.0368535 6.03284 0.00244141Z"
        fill="#FFE9B2"
      />
      <path
        d="M3.93683 3.19775L3.93683 4.52863"
        stroke="black"
        strokeLinecap="round"
      />
      <path
        d="M8.41772 3.46313L7.13174 3.80759"
        stroke="black"
        strokeLinecap="round"
      />
      <path
        d="M4.07068 6.52488C5.13576 7.19032 7.39906 7.05723 8.46414 5.59326"
        stroke="black"
        strokeLinecap="round"
      />
    </svg>
  );
};
