import Avatar from "@/components/avatar";
import { BASE_TOKEN } from "@/config/btc";
import { useAuth } from "@/contexts/auth";
import { useGlobalStore } from "@/stores/use-global";
import LevelIcon from "@/components/icons/level-icon";
import { QRCodeSVG } from "qrcode.react";

export default function InviteDownloadCard({ cardRef }: any) {
  const { userInfo } = useAuth();
  const globalStore = useGlobalStore();
  return (
    <div
      ref={cardRef}
      className="w-[375px] h-[580px] rounded-[20px] bg-linear-to-b from-[#DD9000] to-[#774E00] relative"
    >
      <div className="absolute bottom-[-6px] left-[-4px] z-[1] w-[384px] h-[506px] bg-[url('/share/invite-card.png')] bg-cover bg-center bg-no-repeat">
        <div className="text-[10px] w-[244px] mx-auto rotate-[-3.462deg] mt-[80px]">
          <span className="text-white">
            The first{" "}
            <span className="text-[#FFC42F] font-[600]">
              Trustless Probabilistic Marketplace
            </span>{" "}
            for {BASE_TOKEN.symbol}
            and more
          </span>
        </div>
        <div className="flex items-center mx-auto mt-[10px] gap-[8px] rotate-[-3.462deg] w-[242px]">
          <Avatar size={60} src={userInfo?.icon} address={userInfo?.user} />
          <div>
            <div className="flex items-center gap-[6px]">
              <div className="text-[16px] text-white font-[600] max-w-[100px] truncate">
                {userInfo?.name}
              </div>
              <div className="flex items-center">
                <LevelIcon size={15} className="relative z-[2]" />
                <span className="ml-[-14px] pl-[16px] pr-[6px] text-[8px] text-right text-white border border-white bg-[#3C3C3C] rounded-[12px]">
                  {userInfo?.level}
                </span>
              </div>
            </div>
            <div className="text-[#C3C3CC] text-[10px]">
              invites you to join Dolla
            </div>
            <div className="text-white text-[20px]">{globalStore.code}</div>
          </div>
        </div>
      </div>
      <div className="absolute z-[5] bottom-[14px] left-[34px] h-[48px] flex items-center gap-[10px]">
        <div className="w-[50px] h-[50px] rounded-[6px] bg-white p-[4px]">
          <QRCodeSVG
            value={`${window.location.origin}?code=${globalStore.code}`}
            size={42}
            level="H"
          />
        </div>
        <div className="w-[244px] h-full rounded-[6px] bg-linear-to-r from-[#D1A639] to-[#FFC42F] flex items-center pl-[20px] gap-[8px]">
          <div className="w-[130px] h-[26px] rounded-[6px] bg-[#171717] text-[10px] text-[#FFC42F] flex items-center justify-center">
            {window.location.host}
          </div>
          <div className="text-black text-[10px]">
            <div className="font-[400]">Invite code</div>
            <div className="font-[600]">{globalStore.code}</div>
          </div>
        </div>
      </div>
      <div className="absolute z-[3] bottom-[-10px] left-[0px] w-[358px] h-[592px] bg-[url('/share/invite-wrapper.png')] bg-cover bg-center bg-no-repeat" />
    </div>
  );
}
