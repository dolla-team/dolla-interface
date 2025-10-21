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
            {type === "player" ? "Bidder" : "Seller"}
          </div>
        </div>
      </div>

      <div className="absolute top-[16px] right-[18px] w-[68px]">
        <img src="/share/share-icon.png" className="w-[67px] h-[27px]" />
        <div className="text-[8px] text-[#8A87AA] text-right">
          {dayjs().format("HH:mm:ss YYYY/MM/DD")}
        </div>
      </div>
      {type === "player" && (
        <>
          <div className="text-[14px] text-white mt-[50px]">Your Bid</div>
          <div className="text-[34px] font-[600] text-white">1 times</div>
        </>
      )}
      {type === "seller" && (
        <>
          <div className="text-[14px] text-white mt-[50px]">
            Total wins ({BASE_TOKEN.symbol})
          </div>
          <div className="text-[34px] font-[600] text-white flex items-center gap-[10px]">
            <img src={BASE_TOKEN.icon} className="w-[36px] h-[36px]" />{" "}
            <span>0.0114</span>
          </div>
        </>
      )}
      <div className="flex justify-between mt-[20px]">
        <div className="mt-[30px]">
          {type === "player" && (
            <>
              <div className="text-[14px] text-[#8A87AA] font-[300]">
                Bid Times
              </div>
              <div className="text-[14px] font-[500] text-white">1 times</div>
              <div className="text-[14px] text-[#8A87AA] mt-[20px] font-[300]">
                Target Markets
              </div>
              <div className="text-[14px] font-[500] text-white">
                0.01 {BASE_TOKEN.symbol}
              </div>
            </>
          )}
          {type === "seller" && (
            <>
              <div className="text-[14px] text-[#8A87AA] font-[300]">
                Highest Multiple
              </div>
              <div className="text-[14px] font-[500] text-white">36x</div>
              <div className="text-[14px] text-[#8A87AA] mt-[20px] font-[300]">
                Target Markets
              </div>
              <div className="text-[14px] font-[500] text-white">
                0.01 {BASE_TOKEN.symbol}
              </div>
            </>
          )}
        </div>
        <img src="/share/share-rabbit.png" className="w-[203px] h-[206px]" />
      </div>
      <Bottom />
    </div>
  );
}
