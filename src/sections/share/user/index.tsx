import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import { formatAddress } from "@/utils/format/address";
import clsx from "clsx";
import dayjs from "@/libs/dayjs";
import { BASE_TOKEN } from "@/config/btc";
import Bottom from "../bottom";

export default function UserShareCard({
  type,
  cardRef
}: {
  type: "player" | "seller";
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { userInfo } = useAuth();

  return (
    <div
      ref={cardRef}
      className="w-[375px] h-[500px] p-[20px] relative"
      style={{
        background:
          "radial-gradient(40.3% 53.73% at 84.07% 0%, rgba(255, 206, 82, 0.30) 0%, rgba(255, 206, 82, 0.00) 100%), #000"
      }}
    >
      <div className="flex gap-[10px]">
        <Avatar
          className="border-[2px] border-[#FFFFFFCC] rounded-[6px]"
          size={36}
          src={userInfo?.icon}
          address={userInfo?.user}
          email={userInfo?.show_email}
        />
        <div className="mt-[-4px]">
          <div className="text-[16px] text-white font-[600] leading-[16px]">
            {userInfo?.name || formatAddress(userInfo?.user)}
          </div>
          <div
            className={clsx(
              "px-[7px] py-[2px] inline-block rounded-[9px] text-[10px]",
              type === "player"
                ? "bg-[#FFCE52] text-black"
                : "bg-[#7927C6] text-white"
            )}
          >
            {type === "player" ? "Player" : "Seller"}
          </div>
        </div>
      </div>
      <div className="text-[10px] text-[#8A87AA] mt-[6px]">
        {dayjs().format("YYYY/MM/DD HH:mm:ss")}
      </div>
      <img
        src="/share/share-icon.png"
        className="w-[67px] h-[27px] absolute top-[16px] right-[18px]"
      />
      <div
        className={clsx(
          "w-[260px] h-[82px] mx-auto rounded-[100px] text-center pt-[12px] mt-[20px]",
          type === "player"
            ? "bg-[#FFCE52] text-black"
            : "bg-[#7927C6] text-white"
        )}
      >
        <div className="text-[32px] font-[600] leading-[32px]">3200%</div>
        <div className="text-[12px] mt-[6px]">Return on Investment</div>
      </div>
      <div className="flex mt-[20px]">
        <img src="/share/share-rabbit.png" className="w-[203px] h-[206px]" />
        <div className="mt-[30px]">
          <div className="text-[14px] text-[#8A87AA]">
            {type === "player" ? "Wins" : "Sold"}
          </div>
          <div className="text-[14px] font-[500] text-white">1 times</div>
          <div className="text-[14px] text-[#8A87AA] mt-[10px]">
            {type === "player" ? "Won" : BASE_TOKEN.symbol + " Sold"}
          </div>
          <div className="text-[14px] font-[500] text-white">
            0.01 {BASE_TOKEN.symbol}
          </div>
          <div className="text-[14px] text-[#8A87AA] mt-[10px]">
            {type === "player" ? "Total Valued" : "PnL"}
          </div>
          <div className="text-[14px] font-[500] text-white">$1,225.23</div>
        </div>
      </div>
      <Bottom />
    </div>
  );
}
