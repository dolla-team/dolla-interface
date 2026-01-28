import useCopy from "@/hooks/use-copy";
import CopyIcon from "@/components/icons/copy";
import { useGlobalStore } from "@/stores/use-global";
import InvitedEntry from "../invited/entry";
import clsx from "clsx";
import Popover, {
  PopoverPlacement,
  PopoverTrigger
} from "@/components/popover";
import PopoverCard from "../../popover-card";
import ClaimModal from "./claim-modal";
import { useState } from "react";
import useClaim from "./use-claim";
import Big from "big.js";
import { formatNumber } from "@/utils/format/number";

export default function ReferralPanel() {
  const globalStore = useGlobalStore();
  const { onCopy } = useCopy();
  const [openClaimModal, setOpenClaimModal] = useState(false);
  const { claimableAmount, claimRewards, loading, claiming } = useClaim(() => {
    setOpenClaimModal(false);
  });

  return (
    <>
      <div
        className="w-[280px] h-[208px] p-[16px] rounded-[20px] border border-[#E4E4E4] shadow-[0_0_6px_0_rgba(0,0,0,0.15)]"
        style={{
          background:
            "radial-gradient(120.63% 103.75% at 90.71% 4.57%, rgba(136,61,255,0.20) 0%, rgba(136,61,255,0.00) 100%), #FFF"
        }}
      >
        <div className="text-[12px] text-[#2B3337]">Referral</div>
        <div className="mt-[10px] px-[14px] py-[8px] flex items-center justify-between rounded-[10px] border border-[#E4E4E4] bg-[#FFFFFF4D] text-[#2B3337]">
          <div className="text-[12px] max-w-[200px]">
            {window.location.host}?code={globalStore.code}
          </div>
          <button
            className="button"
            onClick={() => {
              onCopy(`${window.location.origin}?code=${globalStore.code}`);
            }}
          >
            <CopyIcon color="#2B3337" />
          </button>
        </div>
        <div className="mt-[10px]">
          <InvitedEntry tab="player" />
        </div>
        <div className="flex justify-between mt-[12px]">
          <div>
            <div className="text-[#2B3337] text-[12px]">Commission</div>
            {Big(claimableAmount.totalUsd || 0).gt(0) ? (
              <CommissionInfo data={claimableAmount.tokens}>
                <div className="text-[#000] text-[14px] font-[700] mt-[6px] underline button">
                  ~${formatNumber(claimableAmount.totalUsd || 0, 2, true)}
                </div>
              </CommissionInfo>
            ) : (
              <div className="text-[#000] text-[14px] font-[700] mt-[6px] opacity-30">
                $0
              </div>
            )}
          </div>
          {claimableAmount?.user_type === "manager" ? (
            <div
              className="button flex items-center gap-[4px]"
              onClick={() => {
                window.open("https://dashboard.dolla.market/", "_blank");
              }}
            >
              <span className="text-[12px] text-[#2B3337] underline">
                Dashboard
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="13"
                viewBox="0 0 7 13"
                fill="none"
              >
                <path
                  d="M0.576172 0.480225L5.57617 6.48022L0.576172 12.4802"
                  stroke="black"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          ) : (
            <div>
              <div className="text-[#2B3337] text-[12px]">To be claimed</div>
              <div
                className="mt-[6px] flex items-center gap-[6px]"
                onClick={() => {
                  if (Big(claimableAmount.totalClaimable || 0).gt(0)) {
                    setOpenClaimModal(true);
                  }
                }}
              >
                <span
                  className={clsx(
                    "text-[#000] text-[14px] font-[700]",
                    Big(claimableAmount.totalClaimable || 0).gt(0)
                      ? "underline button"
                      : "opacity-30"
                  )}
                >
                  {Big(claimableAmount.totalClaimable || 0).gt(0) && "~"}$
                  {formatNumber(claimableAmount.totalClaimable || 0, 2, true)}
                </span>
                {Big(claimableAmount.totalClaimable || 0).gt(0) && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                    className="button"
                  >
                    <path
                      d="M6 8.58623V1.38623M6 1.38623L1.83333 5.38623M6 1.38623L10.1667 5.38623M1 11.3862H11"
                      stroke="#00B1FF"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ClaimModal
        open={openClaimModal}
        onClose={() => setOpenClaimModal(false)}
        data={claimableAmount.tokens}
        claiming={claiming}
        onClaim={claimRewards}
      />
    </>
  );
}

const CommissionInfo = ({ children, data }: any) => {
  return (
    <Popover
      trigger={PopoverTrigger.Hover}
      placement={PopoverPlacement.Top}
      content={
        <PopoverCard className="w-[265px] text-[12px] p-[10px] flex flex-col gap-[10px]">
          {data?.map((item: any) => (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[6px]">
                <img
                  className="w-[22px] h-[22px]"
                  src={`/tokens/${item.token_type.toLowerCase()}.png`}
                  alt="commission"
                />
                <span className="text-[#2B3337] text-[12px]">
                  {item.token_type}
                </span>
              </div>
              <span className="text-[#2B3337] text-[12px]">
                {formatNumber(item.total_amount || 0, 2, true)}
              </span>
            </div>
          ))}
        </PopoverCard>
      }
    >
      {children}
    </Popover>
  );
};
