// import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";
import Button from "@/components/button";
import { formatNumber } from "@/utils/format/number";

export default function TicketBottom({
  tickets,
  participation,
  onBuyTicket
}: {
  tickets: number;
  participation: number;
  onBuyTicket: () => void;
}) {
  return (
    <div className="flex items-center justify-between h-full relative z-[4] px-[20px]">
      <div>
        <div className="text-[10px] text-white/30">Participation</div>
        <div className="text-[12px] text-white">
          {formatNumber(participation, 0, true)}
        </div>
      </div>
      <div>
        <div className="text-[10px] text-white/30">You Auto Joined</div>
        <div className="text-[12px] text-white">{tickets}</div>
      </div>

      <Button
        className={clsx("button w-[112px] h-[42px]")}
        onClick={() => {
          onBuyTicket();
        }}
      >
        Buy Ticket
      </Button>
    </div>
  );
}
