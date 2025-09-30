import clsx from "clsx";
import Avatar from "@/components/avatar";
import { useAuth } from "@/contexts/auth";
import { formatAddress } from "@/utils/format/address";
import { useState } from "react";
import dayjs from "dayjs";
import StatisticsPlayer from "./statistics-player";
import StatisticsSeller from "./statistics-seller";
import Button from "@/components/button";
import useIsMobile from "@/hooks/use-is-mobile";
import SellerLevel from "@/components/seller-level";
import useCopy from "@/hooks/use-copy";
import CopyIcon from "@/components/icons/copy";
import Twitter from "@/components/icons/twitter";

const Dashboard = (props: any) => {
  const { className, tab } = props;

  const { userInfo } = useAuth();

  const { onCopy } = useCopy();

  const [inviteFrenz] = useState([]);

  return (
    <div
      className={clsx(
        "text-[14px] font-[400] leading-[100%] w-full p-[20px_20px_14px_13px] rounded-[20px] border border-[#E4E4E4] bg-white relative",
        "max-md:p-[12px_10px_17px]",
        className
      )}
    >
      <div className="absolute top-[-38px] left-[50%] translate-x-[-50%] flex flex-col items-center">
        <Avatar
          size={74}
          className="shrink-0 rounded-[8px] border-[2px] border-[#FFFFFFCC]"
          address={userInfo?.user}
          email={userInfo?.email}
        />
        <div className="flex justify-center items-center gap-[6px] mt-[8px]">
          <div className="font-bold text-[#2B3337] text-[20px]">
            {userInfo?.name || userInfo?.show_email}
          </div>
          <SellerLevel isSmall />
        </div>
        <div className="flex items-center gap-[3px] mt-[8px]">
          <span className="text-[12px] text-[#2B3337]">
            {formatAddress(userInfo?.user)}
          </span>
          <button
            className="button"
            onClick={() => {
              onCopy(userInfo?.user);
            }}
          >
            <CopyIcon />
          </button>
        </div>
      </div>
      <div className="w-full pl-[13px] max-md:pl-0">
        <div className="w-full flex justify-between gap-[10px] max-md:relative">
          {/*#region User Info*/}
          <div className="flex gap-[5px]">
            <button className="w-[32px] h-[32px] border border-[#383F47]/30 rounded-[8px] button flex items-center justify-center">
              <Twitter />
            </button>
          </div>
          {/*#endregion*/}
          {/*#region Invite frenz*/}
          <div className="flex flex-col gap-[12px] items-end">
            <div className="flex justify-end gap-[13px] mt-[-10px] items-center">
              {inviteFrenz.length > 0 && (
                <div className="flex items-center gap-[6px] h-[32px] bg-[#F2F2F299] border border-[#E4E4E4] rounded-[16px] pl-[5px] pr-[14px]">
                  <div className="flex items-center">
                    {inviteFrenz.slice(0, 5).map((item: any, index: number) => (
                      <img
                        key={index}
                        src={item.avatar}
                        alt=""
                        className={clsx(
                          "w-[26px] h-[26px] rounded-full border-[2px] border-[#383F47] shrink-0",
                          index > 0 && "ml-[-8px]"
                        )}
                      />
                    ))}
                  </div>
                  <div className="[text-shaow:0px_1px_0px_#000]">
                    {inviteFrenz.length || 0}
                  </div>
                </div>
              )}
              <Button
                className="border border-[#383F47]/30 h-[32px] w-[114px] !rounded-[8px]"
                onClick={() => {}}
              >
                + Invite frenz
              </Button>
            </div>
            <div className="text-[#5E6B7D] mt-[10px] font-[300] text-[12px] max-md:translate-y-[15px] max-md:absolute max-md:right-[0px] max-md:bottom-[20px]">
              Joined{" "}
              {userInfo?.created_at
                ? dayjs(userInfo.created_at).format("MMMM D, YYYY")
                : ""}
            </div>
          </div>
          {/*#endregion*/}
        </div>
      </div>
      {tab === "player" ? <StatisticsPlayer /> : <StatisticsSeller />}
    </div>
  );
};

export default Dashboard;
