import Modal from "@/components/modal";
import CircleArrow from "@/components/icons/circle-arrow";
import { useEffect, useState } from "react";
import { formatAddress } from "@/utils/format/address";
import clsx from "clsx";
import LoadingItem from "./loading-item";
import Avatar from "@/components/avatar";
import useIsMobile from "@/hooks/use-is-mobile";
import { useDebounceFn } from "ahooks";
import Empty from "@/sections/wallet/panels/info/empty";

export default function LucyDrawHistory({
  open,
  onClose,
  historyRound,
  isLoading,
  fetchCurrentRound,
  prizeAmount,
  currentRound
}: {
  open: boolean;
  onClose: () => void;
  historyRound: number;
  isLoading: boolean;
  fetchCurrentRound: (id?: number) => Promise<{
    winningList: any[];
    number: number;
  }>;
  prizeAmount: number;
  currentRound: number;
}) {
  const [round, setRound] = useState(1);
  const [winningList, setWinningList] = useState<any[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!historyRound && !currentRound) return;
    setRound(historyRound || currentRound - 1);
  }, [historyRound, currentRound]);

  const { run: fetchCurrentRoundDebounce } = useDebounceFn(
    () => {
      setWinningList([]);
      fetchCurrentRound(round).then((res) => {
        setWinningList(res.winningList);
      });
    },
    {
      wait: 500
    }
  );

  useEffect(() => {
    if (!open) return;
    fetchCurrentRoundDebounce();
  }, [round, open]);

  return (
    <Modal open={open} onClose={onClose}>
      <div
        className={clsx(
          "bg-[#1D1A16]",
          isMobile ? "w-full rounded-t-[16px]" : "w-[496px] rounded-[16px]"
        )}
      >
        <div className="h-[160px] bg-black/80 backdrop-blur-[10px] rounded-t-[18px]">
          <div className="h-full relative z-[2] flex flex-col justify-center items-center">
            <div
              className="text-[36px] text-white font-[DelaGothicOne] text-shadow-[0px_0px_30px_#8465FF]"
              style={{
                WebkitTextStroke: "1px #3A3A3A"
              }}
            >
              Lucy Draw
            </div>
            <div
              className="text-[24px] text-white font-[DelaGothicOne] text-shadow-[0px_0px_10px_rgba(255, 213, 105, 0.50)]"
              style={{
                WebkitTextStroke: "1px #EEAF0F"
              }}
            >
              ${prizeAmount.toLocaleString()}
            </div>
            <div className="flex items-center gap-[16px] mt-[8px]">
              <CircleArrow
                className={clsx(
                  "rotate-180",
                  round > 1 ? "button" : "opacity-50"
                )}
                onClick={() => {
                  if (round > 1) {
                    setRound(round - 1);
                  }
                }}
              />
              <div className="w-[120px] h-[32px] rounded-[12px] bg-linear-to-r from-[#FFC42F] to-[#FFF698] leading-[32px] text-center pointer-events-none select-none">
                Round #{round}
              </div>
              <CircleArrow
                className={clsx(
                  round < currentRound - 1 ? "button" : "opacity-50"
                )}
                onClick={() => {
                  if (round < currentRound - 1) {
                    setRound(round + 1);
                  }
                }}
              />
            </div>
          </div>
          <HeaderBg />
        </div>
        <div className="py-[8px] h-[476px]">
          {winningList.map((item, index) => (
            <div
              key={item.tx_hash + index}
              className="px-[20px] py-[8px] flex items-center justify-between"
            >
              <div className="flex items-center gap-[6px]">
                <Rank rank={index + 1} />
                <Avatar
                  size={30}
                  email={item.user_info?.email}
                  src={item.user_info?.icon}
                />
                <div className="text-[14px] text-white">
                  {formatAddress(item.user)}
                </div>
              </div>
              <div className="text-[14px] text-[#FFC42F] font-[DelaGothicOne]">
                ${item.volume}
              </div>
            </div>
          ))}
          {winningList.length === 0 && !isLoading && (
            <Empty className="!pt-[100px]" text="No Data" />
          )}
          {isLoading &&
            Array.from({ length: 10 }).map((_, index) => (
              <LoadingItem key={index} />
            ))}
        </div>
      </div>
    </Modal>
  );
}

const HeaderBg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="380"
      height="161"
      viewBox="0 0 380 161"
      fill="none"
      className="absolute bottom-0 left-[50%] translate-x-[-50%]"
    >
      <path
        opacity="0.3"
        d="M191.153 126.691L265.358 -44.8867L304.643 -22.2061L193.152 127.846L343.205 16.3574L365.886 55.6416L194.31 129.843L380 108.318V153.679L194.305 132.15L365.886 206.356L343.205 245.64L193.149 134.147L304.643 284.204L265.359 306.884L191.15 135.296L212.681 320.998H167.319L188.845 135.308L114.643 306.884L75.3584 284.203L186.84 134.158L36.7959 245.644L14.1152 206.359L185.701 132.15L0 153.679V108.318L185.689 129.842L14.1152 55.6396L36.7949 16.3564L186.844 127.841L75.3584 -22.2051L114.643 -44.8857L188.842 126.684L167.319 -59H212.681L191.153 126.691Z"
        fill="url(#paint0_radial_1927_901)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_1927_901"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(190 130.999) rotate(90) scale(189.999 190)"
        >
          <stop stopColor="#FFC42F" />
          <stop offset="1" stopColor="#99761C" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

const Rank = ({ rank }: { rank: number }) => {
  return (
    <div className="relative w-[24px] h-[26px]">
      {rank < 4 && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="26"
          viewBox="0 0 24 26"
          fill="none"
          className="absolute top-0 left-0"
        >
          <path
            d="M11.2005 1.06427C11.6005 0.531782 12.3995 0.531781 12.7995 1.06427L14.5267 3.36343C14.7799 3.70041 15.2172 3.84249 15.6201 3.71866L18.3688 2.87384C19.0054 2.67818 19.6518 3.14782 19.6625 3.81374L19.7084 6.68903C19.7152 7.11046 19.9854 7.48242 20.3841 7.61905L23.1045 8.55126C23.7345 8.76716 23.9814 9.52705 23.5986 10.072L21.9457 12.4252C21.7035 12.7701 21.7035 13.2299 21.9457 13.5748L23.5986 15.928C23.9814 16.4729 23.7345 17.2328 23.1045 17.4487L20.3841 18.3809C19.9854 18.5176 19.7152 18.8895 19.7084 19.311L19.6625 22.1863C19.6518 22.8522 19.0054 23.3218 18.3688 23.1262L15.6201 22.2813C15.2172 22.1575 14.7799 22.2996 14.5267 22.6366L12.7995 24.9357C12.3995 25.4682 11.6005 25.4682 11.2005 24.9357L9.47325 22.6366C9.2201 22.2996 8.78283 22.1575 8.37995 22.2813L5.63118 23.1262C4.99457 23.3218 4.34817 22.8522 4.33752 22.1863L4.29158 19.311C4.28485 18.8895 4.0146 18.5176 3.61588 18.3809L0.895511 17.4487C0.265472 17.2328 0.0185688 16.4729 0.401378 15.928L2.05426 13.5748C2.29653 13.2299 2.29653 12.7701 2.05427 12.4252L0.401378 10.072C0.018569 9.52705 0.265471 8.76716 0.895511 8.55126L3.61588 7.61905C4.0146 7.48242 4.28485 7.11046 4.29158 6.68903L4.33752 3.81374C4.34817 3.14782 4.99457 2.67818 5.63118 2.87384L8.37994 3.71866C8.78283 3.84249 9.22009 3.70041 9.47325 3.36343L11.2005 1.06427Z"
            fill="#6F39F9"
          />
        </svg>
      )}
      <div className="relative z-[2] text-[14px] text-white leading-[26px] text-center">
        {rank}
      </div>
    </div>
  );
};
