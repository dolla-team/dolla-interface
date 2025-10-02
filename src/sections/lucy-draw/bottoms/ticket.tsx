// import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
import Button from "@/components/button";

export default function TicketBottom({
  setIsHistoryOpen,
  onBuyTicket
}: {
  setIsHistoryOpen: (open: boolean) => void;
  onBuyTicket: () => void;
}) {
  return (
    <div className="flex items-center justify-between h-full relative z-[4] px-[20px]">
      <button
        className="button underline text-white text-[12px]"
        onClick={() => setIsHistoryOpen(true)}
      >
        History
      </button>

      <Button
        className={clsx("w-[112px] h-[42px]")}
        soon
        onClick={() => {
          // onBuyTicket();
        }}
      >
        Buy Ticket
      </Button>
    </div>
  );
}
