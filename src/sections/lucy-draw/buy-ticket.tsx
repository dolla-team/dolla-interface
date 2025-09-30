import Modal from "@/components/modal";
import { useMemo, useState } from "react";
import PointIcon from "@/components/icons/point-icon";
import clsx from "clsx";
import { QUOTE_TOKEN } from "@/config/btc";
import useTransfer from "@/hooks/solana/use-transfer";
import Loading from "@/components/icons/loading";
import useUserInfoStore from "@/stores/use-user-info";
import AmountInput from "./amount-input";
import config from "@/config/solana";
import useIsMobile from "@/hooks/use-is-mobile";

export default function BuyTicket({
  showBuyTicket,
  onClose,
  tokenBalance
}: {
  showBuyTicket: boolean;
  onClose: () => void;
  tokenBalance: string;
}) {
  const isMobile = useIsMobile();
  const [ticket, setTicket] = useState(1);
  const userInfoStore = useUserInfoStore();

  const isDisabled = useMemo(() => {
    return ticket > Number(tokenBalance);
  }, [ticket, tokenBalance]);

  const { onTransfer, transferring } = useTransfer({
    token: QUOTE_TOKEN,
    type: "buy_ticket",
    onTransferSuccess: (amount) => {
      userInfoStore.set({
        prize: {
          ...userInfoStore.prize,
          tickets: userInfoStore.prize.tickets + amount
        }
      });
      setTimeout(() => {
        onClose();
      }, 500);
    }
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
          <PointIcon />
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
        <button
          className={clsx(
            "h-[40px] bg-[#FFC42F] rounded-[8px] text-[14px] text-black ml-[20px] mt-[30px]",
            isDisabled ? "opacity-50" : "button",
            isMobile ? "w-[calc(100%-40px)]" : "w-[338px]"
          )}
          onClick={() => {
            if (isDisabled) return;
            onTransfer(ticket, config.ticket_account);
          }}
        >
          {isDisabled ? (
            "Insufficient Balance"
          ) : transferring ? (
            <Loading size={20} />
          ) : (
            "Buy Ticket"
          )}
        </button>
      </div>
    </Modal>
  );
}
