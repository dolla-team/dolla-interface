import Modal from "@/components/modal";
import ModalClose from "@/components/button/modal-close";
import clsx from "clsx";
import { QUOTE_TOKEN } from "@/config/btc";
import Button from "@/components/button";
import useGiftCode from "@/hooks/user/use-gift-code";

export default function RedeemModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { bindGiftCode, binding, codeValidate, giftCode, setGiftCode } =
    useGiftCode({
      onSuccess: () => {
        onClose();
      }
    });

  const isError = !!giftCode && codeValidate?.is_valid === false;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[388px] bg-white rounded-[20px] p-[20px]">
        <div className="flex justify-between items-center">
          <span className="text-[16px] font-[500] text-black">Redeem</span>
          <ModalClose onClose={onClose} />
        </div>
        <div className="text-[14px] text-[#8A87AA] mt-[20px]">Redeem Code</div>
        <div
          className={clsx(
            "mt-[4px] h-[56px] p-[10px] rounded-[10px] border bg-[#F0F0F0] flex items-center",
            isError ? "border-[#FF5C90]" : "border-[#F2F2F233]"
          )}
        >
          <input
            className="flex-1 outline-none bg-transparent text-[16px] font-[500] text-black"
            autoFocus
            value={giftCode}
            onChange={(e) => setGiftCode(e.target.value)}
            placeholder="Enter code"
          />
          {isError && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              onClick={() => setGiftCode("")}
              className="cursor-pointer"
            >
              <circle cx="11" cy="11" r="11" fill="#FF5C90" />
              <path
                d="M6.99993 15L15 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M15.0001 15L7 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
          {codeValidate?.is_valid && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
            >
              <circle cx="11" cy="11" r="11" fill="#27C627" />
              <path
                d="M7 10.4L10.5357 14L16 8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
        {isError && (
          <div className="text-[12px] text-[#FF5C90] mt-[5px]">
            {codeValidate?.msg}
          </div>
        )}
        <div className="flex items-center justify-center gap-[6px] mt-[20px]">
          <img src={QUOTE_TOKEN.icon} className="w-[26px] h-[26px]" />
          <span className="text-[14px] text-black">{QUOTE_TOKEN.symbol}</span>
        </div>
        <Button
          className="h-[46px] w-full !bg-black !text-white mt-[20px]"
          onClick={() => bindGiftCode(giftCode)}
          loading={binding}
        >
          Redeem
        </Button>
      </div>
    </Modal>
  );
}
