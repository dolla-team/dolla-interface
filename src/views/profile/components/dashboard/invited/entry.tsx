import Avatar from "@/components/avatar";
import useReferralList from "@/hooks/airdrop/use-referral-list";
import clsx from "clsx";
import { useState } from "react";
import InvitedModal from "./modal";

export default function InvitedEntry({ tab }: { tab: "player" | "seller" }) {
  const { referralData, currentPage, nextPage, prevPage, loading } =
    useReferralList();
  const [open, setOpen] = useState(false);

  return (
    Number(referralData?.total_num) > 0 && (
      <>
        {tab === "player" ? (
          <PlayerInvitedEntry
            referralData={referralData}
            onOpen={() => setOpen(true)}
          />
        ) : (
          <SellerInvitedEntry
            referralData={referralData}
            onOpen={() => setOpen(true)}
          />
        )}
        <InvitedModal
          open={open}
          onClose={() => setOpen(false)}
          {...{ referralData, currentPage, nextPage, prevPage, loading }}
        />
      </>
    )
  );
}

const PlayerInvitedEntry = ({
  referralData,
  onOpen
}: {
  referralData: any;
  onOpen: () => void;
}) => {
  return (
    <div
      onClick={() => onOpen()}
      className="flex items-center justify-between h-[40px] bg-[#FFFFFF4D] border border-[#E4E4E4] rounded-[10px] p-[8px] button"
    >
      <div className="flex items-center">
        {referralData.list?.slice(0, 5).map((item: any, index: number) => (
          <Avatar
            key={index}
            src={item.account_icon}
            address={item.account_id}
            size={26}
            className={clsx(
              "rounded-full border-[2px] border-[#383F47] shrink-0 text-[12px]",
              index > 0 && "ml-[-8px]"
            )}
          />
        ))}
      </div>
      <div className="[text-shaow:0px_1px_0px_#000]">
        {Number(referralData?.total_num) || 0}
      </div>
    </div>
  );
};

const SellerInvitedEntry = ({
  referralData,
  onOpen
}: {
  referralData: any;
  onOpen: () => void;
}) => {
  return (
    <>
      <div className="text-[#8C8B8B] text-[12px]">Invited</div>
      <div
        onClick={() => onOpen()}
        className="flex items-center gap-[6px] h-[32px] bg-[#F2F2F299] border border-[#E4E4E4] rounded-[16px] pl-[5px] pr-[14px]"
      >
        <div className="flex items-center">
          {referralData.list?.slice(0, 5).map((item: any, index: number) => (
            <Avatar
              key={index}
              src={item.account_icon}
              address={item.account_id}
              size={26}
              className={clsx(
                "rounded-full border-[2px] border-[#383F47] shrink-0 text-[12px]",
                index > 0 && "ml-[-8px]"
              )}
            />
          ))}
        </div>
        <div className="[text-shaow:0px_1px_0px_#000]">
          {Number(referralData?.total_num) || 0}
        </div>
      </div>
    </>
  );
};
