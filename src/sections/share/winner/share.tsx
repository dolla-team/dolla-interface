import MultipleTag from "@/components/multiple-tag";
import clsx from "clsx";
import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import { formatAddress } from "@/utils/format/address";
import dayjs from "@/libs/dayjs";
import Bottom from "../bottom/share";
import { useRef } from "react";
import { formatNumber } from "@/utils/format/number";
import { BASE_TOKEN } from "@/config/btc";

const CARD_IMGS = [
  {
    img: "/share/winner-1.png"
  },
  {
    img: "/share/winner-2.png"
  },
  {
    img: "/share/winner-3.png"
  },
  {
    img: "/share/winner-4.png"
  }
];

export default function WinnerShareCard({
  data,
  cardRef
}: {
  data: any;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const randomRef = useRef(Math.floor(Math.random() * 4) + 1);
  const { userInfo } = useAuth();
  const randomCard = CARD_IMGS[randomRef.current - 1];

  return (
    <div
      className="w-[1000px] h-[562px] rounded-[20px] relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${randomCard.img})`
      }}
      ref={cardRef}
    >
      <>
        <MultipleTag
          multipler={Number(Number(data.multiple).toFixed(0))}
          size={206}
          className="absolute top-[-40px] left-[-40px] pt-[20px]"
          textClassName={clsx(
            data.multiple > 99999
              ? "text-[26px]"
              : data.multiple > 9999
              ? "text-[30px]"
              : data.multiple > 999
              ? "text-[36px]"
              : "text-[42px]"
          )}
          extraContent={<div className="text-[20px] text-center">Multiple</div>}
        />
        <img
          src="/share/share-icon.png"
          className="w-[160px] h-[62px] absolute top-[16px] left-1/2 -translate-x-1/2"
        />

        <div className="text-[10px] text-[#8A87AA] text-center absolute top-[16px] right-[16px]">
          {dayjs(data.time).format("YYYY/MM/DD HH:mm:ss")}
        </div>

        <Bottom className="absolute z-[3] bottom-[20px] left-[30px]" />

        <div className="w-full h-[74px]  bg-linear-to-b from-[#00000000] to-[#000] absolute z-[2] bottom-0 left-0" />
      </>

      <div className="absolute left-[80px] top-[100px] flex flex-col items-center">
        <Avatar
          className="border-[2px] border-[#FFFFFFCC] rounded-[6px] mt-[26px]"
          size={67}
          src={userInfo?.icon}
          address={userInfo?.user}
          email={userInfo?.show_email}
        />
        <div className="text-[16px] text-white font-[600] leading-[16px] mt-[12px]">
          {userInfo?.name || formatAddress(userInfo?.user)}
        </div>
        <div className="text-[26px] text-white font-[500] mt-[20px]">
          {data.bids} Dolla to win
        </div>
        <div
          className="text-[60px] mt-[-6px] font-[900]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, #FFEF43 0%, #FFC42F 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          {data.amount} {BASE_TOKEN.symbol}
        </div>
        <div
          className="text-[20px] mt-[-2px] font-[900]"
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
    </div>
  );
}
