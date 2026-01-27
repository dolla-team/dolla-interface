import Modal from "@/components/modal";
import clsx from "clsx";
import Button from "@/components/button";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import { IS_TEST } from "@/config";

const MIN_CLAIM_AMOUNT: Record<string, number> = {
  USDT: IS_TEST ? 1 : 10,
  BTC: IS_TEST ? 0.00001: 0.0001
};

export default function ClaimModal({
  open,
  onClose,
  data,
  claiming,
  onClaim
}: {
  open: boolean;
  onClose: () => void;
  data: any;
  claiming: boolean;
  onClaim: () => void;
}) {
  return (
    <Modal open={open}>
      <div className={clsx("w-[396px] rounded-[20px] bg-white")}>
        {/* Header */}
        <div className="w-full shrink-0 flex justify-between items-center rounded-t-[16px] p-[17px_23px_16px_31px] bg-black">
          <div className="text-[#fff] text-[16px] font-[500] leading-[100%]">
            Claim
          </div>
          <button type="button" className="button shrink-0" onClick={onClose}>
            <img
              src="/profile/icon-close.svg"
              className="w-[10px] h-[12px] shrink-0"
            />
          </button>
        </div>
        <div className="p-[20px] pt-[10px]">
          {data?.map((item: any) => {
            const isClaimable = !Big(item.claimable_amount || 0).lt(
              MIN_CLAIM_AMOUNT[item.token_type]
            );
            return (
              <div
                className={clsx(
                  "flex items-center justify-between mt-[10px] h-[50px] pl-[10px] pr-[10px] rounded-[12px] border border-[#383F47]/30",
                  !isClaimable ? "bg-[#D9D9D9] opacity-30" : ""
                )}
              >
                <div className="flex items-center gap-[6px]">
                  <img
                    className="w-[22px] h-[22px]"
                    src={`/tokens/${item.token_type.toLowerCase()}.png`}
                  />
                  <span className="text-[12px] text-[#2B3337]">
                    {formatNumber(item.claimable_amount || 0, 2, true)}{" "}
                    {item.token_type}
                  </span>
                </div>
                <div className="flex items-center gap-[10px]">
                  <span className="text-[12px] text-[#2B3337]">
                    ${formatNumber(item.claimable_amount_usd || 0, 2, true)}{" "}
                  </span>
                  <div
                    className={clsx(
                      "w-[20px] h-[20px] rounded-full border border-[#383F47] flex items-center justify-center",
                      !isClaimable ? "bg-[#D9D9D9]" : "bg-[#5CFF72]"
                    )}
                  >
                    {isClaimable && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="8"
                        viewBox="0 0 11 8"
                        fill="none"
                      >
                        <path
                          d="M1 3.5L4 6.5L9.5 1"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <Button
            loading={claiming}
            onClick={onClaim}
            className="w-[354px] h-[50px] mt-[20px] rounded-[12px] !bg-[#1A1E24] text-[14px] text-white font-[500]"
          >
            Claim
          </Button>
        </div>
      </div>
    </Modal>
  );
}
