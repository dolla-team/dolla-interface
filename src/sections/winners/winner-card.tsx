import { formatNumber } from "@/utils/format/number";
import Avatar from "@/components/avatar";
import { AnimatePresence, motion } from "framer-motion";
import useLastWinner from "./use-last-winner";
import { useMemo } from "react";
import Big from "big.js";
import { formatAddress } from "@/utils/format/address";

export default function WinnerCard() {
  const { lastWinner: data } = useLastWinner();

  const [amount, rewardInfo, multiple] = useMemo(() => {
    if (!data) return ["", {}, 0];
    const _rewardInfo = data.reward_token_info[0];
    const _a = Big(data.reward_amount)
      .div(10 ** _rewardInfo.decimals)
      .toString();

    const _returnMultiple = Big(data.pool_info.anchor_price)
      .div(10 ** _rewardInfo.decimals)
      .div(data.times)
      .toString();

    return [_a, _rewardInfo, _returnMultiple];
  }, [data]);

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          initial={{ x: -300, opacity: 0 }} // Slide in from right
          animate={{ x: 0, opacity: 1 }} // Animate to center
          exit={{ x: -300, opacity: 0 }} // Slide out to right
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="w-[190px] h-[188px] relative rounded-[10px] bg-linear-to-t from-[#614D2D] to-[#C79E5C] p-[1px]"
        >
          <div className="w-full h-full rounded-[12px] bg-[radial-gradient(169.33%_41.18%_at_50%_95.53%,_#715B47_0%,_#0A070B_100%)] shadow-[0px_0px_30px_0px_#00000030]">
            <div className="relative z-[2] flex flex-col items-center pt-[16px]">
              <div className="w-[76px] h-[76px] rounded-full flex items-center justify-center border-[1px] border-[#DD9000] bg-[linear-gradient(180deg,_#FFC93F_0%,_#FFDC84_50%,_#DEAF37_100%)] shadow-[0px_0px_30px_6px_rgba(250,252,129,0.30)]">
                <Avatar
                  size={58}
                  address={data?.user_info?.sol_user}
                  email={data?.user_info?.email}
                  className="rounded-full border-[1px] border-[#DD9000]"
                />
              </div>
              <div
                className="text-white text-shadow-[0px_0px_10px_rgba(255,213,105,0.50)] text-[12px] font-[DelaGothicOne] mt-[-14px]"
                style={{
                  WebkitTextStroke: "1px #EEAF0F"
                }}
              >
                Last Winner
              </div>
              <div className="text-[12px] text-white font-[DelaGothicOne]">
                {data.pool_info?.winner_user_email ||
                  formatAddress(data.pool_info.winner_user)}
              </div>
              <div className="text-[10px] mt-[4px] px-[20px] w-full">
                <div className="flex items-center justify-between mt-[4px]">
                  <div className="text-[#8C8B8B]">Won</div>
                  <div className="text-white truncate">
                    {amount} {rewardInfo.symbol?.toUpperCase()}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-[4px]">
                  <div className="text-[#8C8B8B]">Valued</div>
                  <div className="text-white truncate">
                    ${formatNumber(data?.reward_usd, 2, true)}{" "}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-[4px]">
                  <div className="text-[#8C8B8B]">Cost</div>
                  <div className="text-white truncate">
                    ${formatNumber(data?.times, 2, true)}{" "}
                  </div>
                </div>
              </div>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="188"
              viewBox="0 0 191 118"
              fill="none"
              className="absolute top-[1px] left-[1px]"
            >
              <foreignObject x="-20" y="-20" width="231" height="158">
                <div
                  style={{
                    backdropFilter: "blur(10px)",
                    clipPath: "url(#bgblur_0_2076_5263_clip_path)",
                    height: "100%",
                    width: "100%"
                  }}
                ></div>
              </foreignObject>
              <path
                opacity="0.5"
                d="M0 10C0 4.47716 4.47715 0 10 0H181C186.523 0 191 4.47715 191 10V99.6692C191 101.174 190.627 102.654 189.484 103.632C184.678 107.745 165.661 118 95.5 118C25.339 118 6.3219 107.745 1.51646 103.633C0.372865 102.654 0 101.174 0 99.6692V10Z"
                fill="#FFC42F"
                fillOpacity="0.25"
              />
              <defs>
                <clipPath
                  id="bgblur_0_2076_5263_clip_path"
                  transform="translate(20 20)"
                >
                  <path d="M0 10C0 4.47716 4.47715 0 10 0H181C186.523 0 191 4.47715 191 10V99.6692C191 101.174 190.627 102.654 189.484 103.632C184.678 107.745 165.661 118 95.5 118C25.339 118 6.3219 107.745 1.51646 103.633C0.372865 102.654 0 101.174 0 99.6692V10Z" />
                </clipPath>
              </defs>
            </svg>
          </div>

          <div className="absolute top-[-14px] right-[-14px] w-[61px] h-[63px]">
            <div className="text-black relative z-[2] rotate-[15deg] flex flex-col items-center justify-center w-full h-full  font-[DelaGothicOne]">
              <span className="font-bold text-[20px]">
                {multiple ? formatNumber(multiple, 2, true) : 0}{" "}
              </span>
              <span className="text-[12px] mt-[-8px]">X</span>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="61"
              height="63"
              viewBox="0 0 61 63"
              fill="none"
              className="absolute top-0 left-0"
            >
              <path
                d="M29.7337 0.913819C30.1334 0.437192 30.8666 0.437192 31.2663 0.913819L34.5497 4.8296C34.8617 5.20166 35.3959 5.29584 35.8163 5.05293L40.241 2.49632C40.7796 2.18513 41.4686 2.43589 41.6811 3.02047L43.4273 7.82312C43.5932 8.27944 44.063 8.55064 44.5411 8.46616L49.5734 7.57708C50.186 7.46886 50.7476 7.94015 50.7474 8.56217L50.7457 13.6724C50.7455 14.158 51.0942 14.5735 51.5724 14.6576L56.6053 15.5433C57.2179 15.6511 57.5845 16.2861 57.3715 16.8705L55.6221 21.672C55.4559 22.1282 55.6414 22.6379 56.062 22.8805L60.4884 25.4341C61.0272 25.745 61.1546 26.467 60.7546 26.9434L57.4684 30.857C57.1562 31.2288 57.1562 31.7712 57.4684 32.143L60.7546 36.0566C61.1546 36.533 61.0272 37.255 60.4884 37.5659L56.062 40.1195C55.6414 40.3621 55.4559 40.8718 55.6221 41.328L57.3715 46.1295C57.5845 46.7139 57.2179 47.3489 56.6053 47.4567L51.5724 48.3424C51.0942 48.4265 50.7455 48.842 50.7457 49.3276L50.7474 54.4378C50.7476 55.0598 50.186 55.5311 49.5734 55.4229L44.5411 54.5338C44.063 54.4494 43.5932 54.7206 43.4273 55.1769L41.6811 59.9795C41.4686 60.5641 40.7796 60.8149 40.241 60.5037L35.8163 57.9471C35.3959 57.7042 34.8617 57.7983 34.5497 58.1704L31.2663 62.0862C30.8666 62.5628 30.1334 62.5628 29.7337 62.0862L26.4503 58.1704C26.1383 57.7983 25.6041 57.7042 25.1837 57.9471L20.759 60.5037C20.2204 60.8149 19.5314 60.5641 19.3189 59.9795L17.5727 55.1769C17.4068 54.7206 16.937 54.4494 16.4589 54.5338L11.4266 55.4229C10.814 55.5311 10.2524 55.0598 10.2526 54.4378L10.2543 49.3276C10.2545 48.842 9.90583 48.4265 9.42763 48.3424L4.39472 47.4567C3.78212 47.3489 3.41552 46.7139 3.62846 46.1295L5.37788 41.328C5.5441 40.8718 5.35859 40.3621 4.93801 40.1195L0.511552 37.5659C-0.0272352 37.255 -0.154553 36.533 0.245432 36.0566L3.53155 32.143C3.84378 31.7712 3.84378 31.2288 3.53155 30.857L0.245432 26.9434C-0.154553 26.467 -0.0272357 25.745 0.511551 25.4341L4.93801 22.8805C5.35859 22.6379 5.5441 22.1282 5.37788 21.672L3.62846 16.8705C3.41552 16.2861 3.78212 15.6511 4.39472 15.5433L9.42763 14.6576C9.90583 14.5735 10.2545 14.158 10.2543 13.6724L10.2526 8.56217C10.2524 7.94015 10.814 7.46886 11.4266 7.57708L16.4589 8.46616C16.937 8.55064 17.4068 8.27944 17.5727 7.82312L19.3189 3.02047C19.5314 2.43589 20.2204 2.18513 20.759 2.49632L25.1837 5.05293C25.6041 5.29584 26.1383 5.20166 26.4503 4.8296L29.7337 0.913819Z"
                fill={"#EBFF57"}
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
