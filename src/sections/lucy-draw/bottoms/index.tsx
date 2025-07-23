import StarBg from "../star-bg";
import TicketBottom from "./ticket";
import Avatar from "@/components/avatar";

export default function Bottoms({
  status,
  tickets,
  onBuyTicket,
  winningList = []
}: {
  status: number;
  tickets: number;
  onBuyTicket: () => void;
  winningList: any[];
}) {
  return (
    <>
      <div className="flex absolute z-[1] bottom-0">
        <StarBg />
        <StarBg className="ml-[-50px]" />
        <StarBg className="ml-[-50px]" />
      </div>
      {status === 0 && (
        <TicketBottom tickets={tickets} onBuyTicket={onBuyTicket} />
      )}
      {status === 1 && (
        <div className="relative z-[2] w-full h-full flex items-center justify-center bg-[url(/btc/lucky-draw-loading.gif)] bg-no-repeat bg-center bg-contain" />
      )}
      {status === 2 && (
        <>
          <div className="relative z-[2] w-full h-full flex items-center justify-center">
            {winningList.map((item, index) => (
              <Avatar
                address={item.user}
                key={index}
                className="border border-[#DD9000] ml-[-10px]"
                size={30}
                email={item.user_info?.email}
              />
            ))}
          </div>
          <div className="absolute bottom-[-100px] left-0 w-[300px] h-[300px] bg-[url(/btc/lucky-draw-success.gif)] bg-no-repeat bg-center bg-contain" />
        </>
      )}
    </>
  );
}
