import MultipleTag from "@/components/multiple-tag";
import clsx from "clsx";
import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import { formatAddress } from "@/utils/format/address";
import dayjs from "@/libs/dayjs";
import Bottom from "../bottom/download";
import { useRef } from "react";
import { formatNumber } from "@/utils/format/number";
import { BASE_TOKEN } from "@/config/btc";

const DOWNLOAD_IMGS: Record<number, any> = {
  1: {
    img: "/share/winner-download-1.png",
    width: 325,
    height: 238
  },
  2: {
    img: "/share/winner-download-2.png",
    width: 375,
    height: 252
  },
  3: {
    img: "/share/winner-download-3.png",
    width: 269,
    height: 251
  },
  4: {
    img: "/share/winner-download-4.png",
    width: 374,
    height: 241
  }
};

export default function WinnerDownloadCard({
  data,
  cardRef
}: {
  data: any;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const randomRef = useRef(Math.floor(Math.random() * 4) + 1);
  const { userInfo } = useAuth();
  const randomCard = DOWNLOAD_IMGS[randomRef.current];
  return (
    <div
      className="w-[375px] h-[500px] rounded-[20px] relative overflow-hidden"
      style={{
        background:
          "radial-gradient(40.3% 53.73% at 84.07% 0%, rgba(255, 206, 82, 0.30) 0%, rgba(255, 206, 82, 0.00) 100%), #000"
      }}
      ref={cardRef}
    >
      <>
        <img
          src="/share/share-icon.png"
          className="w-[67px] h-[27px] absolute top-[16px] left-[18px]"
        />
        <div className="absolute top-[0px] left-[50%] translate-x-[-50%] w-[250px] h-[182px] bg-[url('/share/btc-bg.png')] bg-cover bg-center bg-no-repeat" />
        <MultipleTag
          size={130}
          className="absolute top-[-30px] right-[-20px] pt-[20px]"
          multipler={Number(Number(data.multiple).toFixed(0))}
          textClassName={clsx(
            data.multiple > 99999
              ? "text-[16px]"
              : data.multiple > 9999
              ? "text-[18px]"
              : data.multiple > 999
              ? "text-[20px]"
              : "text-[26px]"
          )}
          extraContent={
            <div className="text-[14px] text-center font-[400]">Multiple</div>
          }
        />
        <Bottom
          className="absolute z-[3] bottom-[20px] left-0 w-full px-[20px]"
          textColor="text-white"
          textClassName="h-[24px] leading-[24px] rounded-[6px] bg-black/5 backdrop-blur-[10px]"
        />
        <div
          className="absolute z-[1] bottom-[0px] left-[50%] translate-x-[-50%]"
          style={{
            backgroundImage: `url(${randomCard.img})`,
            backgroundSize: `${randomCard.width}px`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: `${randomCard.width}px`,
            height: `${randomCard.height}px`
          }}
        />
        <div className="w-full h-[74px]  bg-linear-to-b from-[#00000000] to-[#000] absolute z-[2] bottom-0 left-0" />
      </>

      <div className="flex flex-col items-center pt-[14px] relative z-[5]">
        <div className="text-[10px] text-[#8A87AA] text-center">
          {dayjs(data.time).format("YYYY/MM/DD HH:mm:ss")}
        </div>

        <div className="absolute top-[30px] flex flex-col items-center">
          <Avatar
            className="border-[2px] border-[#FFFFFFCC] rounded-[6px] mt-[26px]"
            size={36}
            src={userInfo?.icon}
            address={userInfo?.user}
            email={userInfo?.show_email}
          />
          <div className="text-[16px] text-white font-[600] leading-[16px] mt-[6px]">
            {userInfo?.name || formatAddress(userInfo?.user)}
          </div>
          <div className="text-[20px] text-white font-[900] mt-[20px]">
            {data.bids} Dolla to win
          </div>
          <div
            className="text-[46px] mt-[-6px] font-[900]"
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
            className="text-[20px] mt-[-6px] font-[900]"
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
    </div>
  );
}
