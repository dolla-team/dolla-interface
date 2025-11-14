import { QRCodeSVG } from "qrcode.react";
import { useGlobalStore } from "@/stores/use-global";
import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import LevelIcon from "@/components/icons/level-icon";

export default function InviteShareCard({ cardRef }: any) {
  const globalStore = useGlobalStore();
  const { userInfo } = useAuth();
  return (
    <div
      ref={cardRef}
      className="w-[666px] h-[375px] relative rounded-[20px] bg-[url('/share/invite-share-bg.png')] bg-cover bg-center bg-no-repeat"
    >
      <div className="flex items-center gap-[20px] pt-[20px] pl-[30px]">
        <img src="/share/share-icon.png" className="w-[112px] h-[45px]" />
        <div className="text-[12px] text-white w-[270px]">
          The first{" "}
          <span className="text-[#FFC42F] font-[600]">
            Trustless Probabilistic Marketplace
          </span>{" "}
          for BTC and more
        </div>
      </div>
      <div className="w-[154px] h-[154px] rounded-[6px] p-[20px] bg-white ml-[30px] mt-[40px]">
        <QRCodeSVG
          value={`${window.location.origin}?code=${globalStore.code}`}
          size={114}
          level="H"
        />
      </div>
      <div className="flex items-center justify-between pl-[30px] pr-[20px] mt-[30px]">
        <div className="flex items-center gap-[14px]">
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
            <div className="text-[#C3C3CC] text-[10px] font-[300]">
              invites you to join Dolla market
            </div>
            <div className="text-white text-[20px]">{globalStore.code}</div>
          </div>
        </div>
        <div className="w-[130px] h-[26px] mt-[36px] rounded-[6px] bg-[#FFC42F] text-[10px] text-[#000] flex items-center justify-center">
          {window.location.host}
        </div>
      </div>
    </div>
  );
}
