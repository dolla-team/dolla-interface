import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import { formatAddress } from "@/utils/format/address";
import clsx from "clsx";
import dayjs from "@/libs/dayjs";

export default function UserShareCard({ type }: { type: "player" | "seller" }) {
  const { userInfo } = useAuth();
  return (
    <div
      className="w-[375px] h-[500px] p-[20px]"
      style={{
        background:
          "radial-gradient(40.3% 53.73% at 84.07% 0%, rgba(255, 206, 82, 0.30) 0%, rgba(255, 206, 82, 0.00) 100%), #000"
      }}
    >
      <div className="flex justify-between">
        <div>
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
                  "px-[7px] py-[2px] inline-block rounded-[9px] text-[10px] text-black",
                  type === "player" ? "bg-[#FFCE52]" : "bg-[#7927C6]"
                )}
              >
                {type === "player" ? "Player" : "Seller"}
              </div>
            </div>
          </div>
          <div className="text-[10px] text-[#8A87AA] mt-[6px]">
            {dayjs().format("YYYY/MM/DD HH:mm:ss")}
          </div>
        </div>
      </div>
    </div>
  );
}
