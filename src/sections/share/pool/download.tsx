import dayjs from "@/libs/dayjs";
import Bottom from "../bottom/download";
import { BASE_TOKEN } from "@/config/btc";
import { formatNumber } from "@/utils/format/number";
import PoolMarket from "./market";

export default function PoolDownloadCard({
  cardRef,
  data
}: {
  cardRef: React.RefObject<HTMLDivElement | null>;
  data: any;
}) {
  return (
    <div
      ref={cardRef}
      className="w-[375px] h-[580px] overflow-hidden relative border border-[#E0E0E0] rounded-[20px] shadow-[0_0_10px_0_rgba(0,_0,_0,_0.10)]"
      style={{
        background:
          "radial-gradient(40.3% 53.73% at 84.07% 0%, rgba(255, 206, 82, 0.30) 0%, rgba(255, 206, 82, 0.00) 100%), #FFF"
      }}
    >
      <img
        src="/share/share-icon.png"
        className="w-[86px] h-[33px] absolute top-[12px] right-[18px] z-[2]"
      />
      <div className="text-[#44425D] text-[10px] relative z-[5] p-[20px]">
        {dayjs(data.time).format("YYYY/MM/DD HH:mm:ss")}
      </div>
      <div className="absolute bottom-[-7px] left-0 z-[1] rounded-b-[20px] bg-[url('/share/pool-download-bg.svg')] bg-cover bg-center bg-no-repeat w-[375px] h-[537px]" />
      <div className="absolute left-[10px] top-[0px] z-[4] bg-[url('/share/pool-top-hand.png')] bg-cover bg-center bg-no-repeat w-[163px] h-[174px]" />
      <div className="relative z-[3] pt-[90px] pl-[30px]">
        <div className="text-[18px] text-white font-[500] text-center">
          Bid for the {data.amount} {BASE_TOKEN.symbol} Market
        </div>
        <div className="flex items-center gap-[2px] justify-center">
          <div className="text-[18px] text-white font-[500]">Valued</div>.
          <div
            className="text-[18px] text-white font-[900]"
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
        <Bottom className="absolute z-[3] bottom-[20px] left-0 w-full px-[20px]" />
      </div>
      <div className="absolute z-[5] bottom-[0px] right-0 w-[273px] h-[164px] bg-[url('/share/pool-bottom-hand.png')] bg-cover bg-center bg-no-repeat" />
      <div className="absolute z-[4] bottom-[90px] right-[40px] w-[140px] h-[140px] bg-[url('/share/pool-btc.png')] bg-cover bg-center bg-no-repeat"></div>
    </div>
  );
}
