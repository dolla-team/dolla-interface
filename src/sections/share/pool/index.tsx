import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import { formatAddress } from "@/utils/format/address";
import clsx from "clsx";
import dayjs from "@/libs/dayjs";
import Bottom from "../bottom/share";
import Market from "@/views/profile/components/market";
import { BASE_TOKEN } from "@/config/btc";

export default function UserShareCard({
  cardRef
}: {
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { userInfo } = useAuth();

  return (
    <div
      ref={cardRef}
      className="w-[375px] h-[500px] p-[20px] relative"
      style={{
        background:
          "radial-gradient(40.3% 53.73% at 84.07% 0%, rgba(255, 206, 82, 0.30) 0%, rgba(255, 206, 82, 0.00) 100%), #fff"
      }}
    >
      <img
        src="/share/share-icon.png"
        className="w-[67px] h-[27px] absolute top-[16px] right-[18px] z-[2]"
      />
      <div className="relative z-[5]">
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
                "px-[7px] py-[2px] inline-block rounded-[9px] text-[10px] bg-[#7927C6] text-white"
              )}
            >
              Seller
            </div>
          </div>
        </div>
        <div className="text-[10px] text-[#8A87AA] mt-[6px]">
          {dayjs().format("YYYY/MM/DD HH:mm:ss")}
        </div>
        <div className="text-center text-[20px] font-[500] text-black mt-[80px]">
          Bid for my {BASE_TOKEN.symbol} Market
        </div>
        <div className="text-center">
          <div className="text-center text-[16px] text-white inline-block px-[20px] py-[2px] bg-black rounded-[20px] bg-[#1A1E24] border border-[#383F47]">
            #123
          </div>
        </div>
        <Market
          data={{
            accumulative_bids: 0,
            anchor_price: 0,
            reward_amount: 1e18,
            reward_token_info: [
              {
                decimals: BASE_TOKEN.decimals,
                symbol: BASE_TOKEN.symbol
              }
            ],
            pool_id: 13,
            pool_user_info: {
              icon: userInfo?.icon,
              email: userInfo?.show_email,
              name: userInfo?.name,
              user: userInfo?.user
            },
            status: 1,
            participants: 0
          }}
          footer={
            <div className="mt-[10px] w-full px-[13px] bg-black rounded-b-[20px] py-[17px] text-white text-[12px] leading-[100%]">
              {dayjs().format("HH:mm D MMM, YYYY")}
            </div>
          }
          className="absolute bottom-[-6px] left-[50%] translate-x-[-50%] z-[2] w-[301px] h-[171px]"
        />
        <Bottom
          className="bg-white !bg-transparent"
          titleColor="text-black"
          textColor="text-black"
        />
      </div>
      <div className="absolute top-[60px] left-[50%] translate-x-[-50%] z-[1] bg-[url('/share/share-rabbit.png')] bg-no-repeat bg-center bg-cover w-[203px] h-[206px]" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="375"
        height="361"
        viewBox="0 0 375 361"
        fill="none"
        className="absolute bottom-0 left-0 z-[2]"
      >
        <path
          d="M0 0C0 0 40.1095 15.0046 187.5 15.0046C334.89 15.0046 375 0 375 0L375 361H0.000235961L0 0Z"
          fill="#FFC42F"
        />
      </svg>
    </div>
  );
}
