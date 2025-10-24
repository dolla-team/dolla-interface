import dayjs from "@/libs/dayjs";
import Bottom from "../bottom/share";
import PoolMarket from "./market";
import { BASE_TOKEN } from "@/config/btc";
import { formatNumber } from "@/utils/format/number";

export default function PoolShareCard({
  cardRef,
  data
}: {
  cardRef: React.RefObject<HTMLDivElement | null>;
  data: any;
}) {
  return (
    <div
      ref={cardRef}
      className="w-[666px] h-[375px] overflow-hidden relative rounded-[20px]"
      style={{
        background:
          "radial-gradient(40.3% 53.73% at 84.07% 0%, rgba(255, 206, 82, 0.30) 0%, rgba(255, 206, 82, 0.00) 100%), #FFF"
      }}
    >
      <img
        src="/share/share-icon.png"
        className="w-[86px] h-[33px] absolute top-[10px] left-1/2 -translate-x-1/2 z-[2]"
      />
      <div className="text-[#44425D] text-[10px] z-[5] absolute top-[10px] right-[20px]">
        {dayjs(data.time).format("YYYY/MM/DD HH:mm:ss")}
      </div>
      <div className="absolute bottom-[-7px] left-0 z-[1] rounded-b-[20px] bg-[url('/share/pool-share-bg.svg')] bg-cover bg-center bg-no-repeat w-[665px] h-[343px]" />
      <div className="absolute left-[40px] top-[1px] z-[4] bg-[url('/share/pool-top-hand.png')] bg-cover bg-center bg-no-repeat w-[163px] h-[174px]" />
      <div className="relative z-[5] pt-[90px] pl-[30px] flex">
        <div className="w-[208px]">
          <div className="text-[26px] text-white font-[500] mt-[30px]">
            Bid for the {data.amount} {BASE_TOKEN.symbol} Market
          </div>
          <div className="text-[16px] text-white font-[500]">Valued</div>
          <div
            className="text-[20px] text-white font-[900]"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, #FFEF43 0%, #FFC42F 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            ${formatNumber(data.price, 2, true)}
          </div>
        </div>
        <PoolMarket data={data} />
      </div>
      <div className="w-full h-[74px] rounded-b-[20px] bg-linear-to-b from-[#00000000] to-[#000] absolute z-[6] bottom-0 left-0">
        <Bottom className="absolute z-[3] bottom-[10px] left-0 w-full px-[20px]" />
      </div>
      <div className="absolute z-[5] bottom-[-30px] right-0 w-[273px] h-[164px] bg-[url('/share/pool-bottom-hand.png')] bg-cover bg-center bg-no-repeat" />
      <div className="absolute z-[4] bottom-[140px] right-[24px] w-[140px] h-[140px] bg-[url('/share/pool-btc.png')] bg-cover bg-center bg-no-repeat"></div>
    </div>
  );
}
