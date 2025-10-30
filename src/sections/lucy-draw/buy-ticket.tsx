import Modal from "@/components/modal";
import { useMemo, useState, memo } from "react";
import clsx from "clsx";
import useTransfer from "@/hooks/near/use-buy-ticket";
import AmountInput from "./amount-input";
import useIsMobile from "@/hooks/use-is-mobile";
import Big from "big.js";
import useUserInfoStore from "@/stores/use-user-info";
import { QUOTE_TOKEN } from "@/config/btc";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth";

export default memo(function BuyTicket({
  showBuyTicket,
  onClose
}: {
  showBuyTicket: boolean;
  onClose: () => void;
}) {
  const { nearAccount } = useAuth();
  const isMobile = useIsMobile();
  const [ticket, setTicket] = useState(1);
  const userInfoStore = useUserInfoStore();

  const tokenBalance = nearAccount?.onlyQuoteBalance;

  const errorTips = useMemo(() => {
    if (Big(ticket).gt(Big(tokenBalance || 0))) {
      return "Insufficient Balance";
    }
    if (Number(ticket) === 0) {
      return "Input amount";
    }
    return "";
  }, [ticket, tokenBalance]);

  const { transfer: onTransfer, loading: transferring } = useTransfer(() => {
    userInfoStore.set({
      prize: {
        ...userInfoStore.prize,
        tickets: userInfoStore.prize.tickets + ticket
      }
    });
  });

  return (
    <Modal open={showBuyTicket} onClose={onClose} isForceNormal={isMobile}>
      <div
        className={clsx(
          "rounded-[16px] border border-[#E4E4E4] bg-white h-[444px] w-[378px]",
          isMobile && "max-w-[90vw]"
        )}
      >
        <div className="h-[54px] bg-[#000000] rounded-t-[16px] flex items-center justify-between px-[16px]">
          <div className="text-[20px] text-white">Buy Ticket</div>
          <button className="w-[24px] h-[24px] button" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="12"
              viewBox="0 0 10 12"
              fill="none"
            >
              <path
                d="M5 4.57422L8 0.592773H10L6 5.90137L10 11.21H8L5 7.22852L2 11.21H0L4 5.90137L0 0.592773H2L5 4.57422Z"
                fill="#BBACA6"
              />
            </svg>
          </button>
        </div>
        <div className="bg-[url(/btc/ticket3.png)] w-[186px] h-[126px] bg-no-repeat bg-center bg-contain mx-auto mt-[16px]" />
        <div className="flex justify-center items-center gap-[8px]">
          <span className="text-[16px] font-[DelaGothicOne]">{ticket}</span>
          <img src={QUOTE_TOKEN.icon} className="w-[24px] h-[24px]" />
        </div>
        <div
          className={clsx(
            "mx-auto mt-[40px]",
            isMobile ? "w-[calc(100%-40px)]" : "w-[338px]"
          )}
        >
          <div className="flex items-center justify-between text-[14px]">
            <span>Amount</span>
            <span
              className="underline button"
              onClick={() => {
                setTicket(Math.floor(Number(tokenBalance)));
              }}
            >
              Max
            </span>
          </div>
          <AmountInput
            amount={ticket}
            onChange={setTicket}
            max={Number(tokenBalance)}
          />
        </div>
        <Button
          className={clsx(
            "h-[40px] !bg-[#FFC42F] rounded-[8px] w-[338px] text-black ml-[20px] mt-[30px] button"
          )}
          onClick={() => {
            console.log("transferring:", transferring);
            if (errorTips || transferring) return;
            onTransfer(ticket);
          }}
          loading={transferring}
          disabled={!!errorTips || transferring}
        >
          {errorTips ? errorTips : "Buy Ticket"}
        </Button>
      </div>
    </Modal>
  );
});
