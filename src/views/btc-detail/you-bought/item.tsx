import ItemBg, { WinnerBg, WinnerBtc } from "./item-bg";
import { formatNumber } from "@/utils/format/number";
import PointIcon from "@/components/icons/point-icon";
import clsx from "clsx";
import dayjs from "@/libs/dayjs";
import { useMemo } from "react";
import { BASE_TOKEN } from "@/config/btc";
import Big from "big.js";
import Button from "@/components/button";
import { useNavigate } from "@/libs/router";
import { useBtcContext } from "@/views/btc/context";
import useBtcDetailStore from "@/stores/use-btc-detail";

export default function YouBoughtItem({ data }: { data: any }) {
  const btcDetailStore = useBtcDetailStore();
  const [type, ticketNumber, pointReward, poolAmount] = useMemo(() => {
    const _ticketNumber = Number(data.winner_ticket_number) || 0;
    const _pointReward = Number(data.winner_point_reward) || 0;
    let _type = 2;
    if (_ticketNumber > 0 || _pointReward > 0) {
      _type = 1;
    }
    if (data.is_winner) _type = 0;
    const _poolAmount = Big(data.reward_amount)
      .div(10 ** BASE_TOKEN.decimals)
      .toString();
    return [_type, _ticketNumber, _pointReward, _poolAmount];
  }, [data]);

  const navigate = useNavigate();
  const { onReplay, setShowDetail } = useBtcContext();

  return (
    <div className="relative w-[446px] h-[76px] shrink-0 group">
      <ItemBg type={type} id={data.id} />
      {type === 0 && (
        <div className="absolute w-[430px] h-full inset-0 z-[10] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="relative flex items-center justify-center gap-[10px] w-full h-full rounded-[12px] border border-[#E4E4E4] bg-white/1 backdrop-blur-[20px]">
            <Button
              onClick={() => {
                navigate(`/portfolio/bidder`);
              }}
              className="button !w-[142px] h-[40px] rounded-[20px] bg-white text-[10px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
            >
              Check My Profile
            </Button>
            <Button
              onClick={() => {
                setShowDetail(false);
                setTimeout(() => {
                  btcDetailStore.set({
                    bidResult: {
                      is_winner: true
                    },
                    bids: data.times,
                    flipStatus: 4
                  });
                  onReplay();
                }, 300);
              }}
              className="button !w-[132px] h-[40px] gap-[4px] rounded-[20px] bg-white text-[10px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <circle cx="10" cy="10" r="10" fill="black" />
                <path
                  d="M13.5 9.13397C14.1667 9.51887 14.1667 10.4811 13.5 10.866L9 13.4641C8.33333 13.849 7.5 13.3679 7.5 12.5981L7.5 7.40192C7.5 6.63212 8.33333 6.151 9 6.5359L13.5 9.13397Z"
                  fill="white"
                />
              </svg>
              <span>Play Process</span>
            </Button>
          </div>
        </div>
      )}
      <div className={clsx("relative z-[2] pl-[18px] pt-[10px]")}>
        <div
          className={clsx(
            "text-[18px] text-black font-[500]",
            type !== 0 && "opacity-30"
          )}
        >
          {type !== 0
            ? `$${data.times}`
            : `$${data.times} expand to ${poolAmount} ${BASE_TOKEN.symbol} `}
        </div>
        <div className="text-[12px] text-[#2B3337] mt-[4px] opacity-30">
          {dayjs(data.created_at).format("HH:mm DD MMM, YYYY")}
        </div>
      </div>
      <div className="w-[120px] h-[60px] rounded-[10px] bg-[#FFFFFF4D] absolute top-[6px] right-[22px] flex flex-col gap-[6px] items-center justify-center">
        {type === 0 && (
          <>
            <WinnerBg />
            <WinnerBtc />
          </>
        )}

        {ticketNumber > 0 && (
          <div className="flex items-center justify-center gap-[6px]">
            <span className="text-[12px] text-[#434343]">x{ticketNumber}</span>
            <img
              src="/lucky-draw/ticket.png"
              alt="ticket"
              className="w-[37px] h-[22px]"
            />
          </div>
        )}
        {pointReward > 0 && (
          <div className="flex items-center justify-center gap-[6px]">
            <span className="text-[12px] text-[#434343]">
              {formatNumber(pointReward, 0, true)}
            </span>
            <PointIcon size={20} />
          </div>
        )}
        {type === 2 && (
          <span className="text-[14px] text-[#2B3337]/30">Nah</span>
        )}
      </div>
      <div className="absolute flex items-center gap-[6px] top-[10px] right-[160px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="48"
          viewBox="0 0 19 48"
          fill="none"
        >
          <path
            opacity="0.1"
            d="M10.0631 47.6V3.39997L13.9391 7.41197H-0.000921849V-2.76566e-05H18.9031V47.6H10.0631Z"
            fill="white"
          />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="42"
          height="58"
          viewBox="0 0 42 58"
          fill="none"
        >
          <path
            opacity="0.1"
            d="M34.1871 27.4863C37.2807 25.88 39.2495 23.0242 38.7924 18.2766C38.1946 11.7798 32.9401 9.60228 25.9795 8.99555V0H20.5656V8.74565C19.1593 8.74565 17.718 8.78134 16.2767 8.81702V0H10.8628V8.99555C8.87231 9.05661 6.55405 9.02682 0 8.99555V14.8497C4.27439 14.7729 6.51713 14.494 7.03098 17.277V41.9076C6.70466 44.1157 4.9644 43.7977 1.08974 43.7281L0.000111501 50.2606C9.87124 50.2606 10.8629 50.2963 10.8629 50.2963V58H16.2768V50.4034C17.7532 50.439 19.1946 50.439 20.5657 50.439V58H25.9796V50.2963C35.0495 49.7965 41.1127 47.4763 41.9213 38.802C42.5539 31.8413 39.3196 28.7356 34.1871 27.4863ZM16.3822 15.2423C19.4407 15.2423 29.0028 14.2786 29.0028 20.7396C29.0028 26.9152 19.4408 26.2012 16.3822 26.2012V15.2423ZM16.3822 43.7638V31.6985C20.0383 31.6985 31.2342 30.6633 31.2342 37.7313C31.234 44.5492 20.0383 43.7638 16.3822 43.7638Z"
            fill="white"
          />
        </svg>
      </div>
    </div>
  );
}
