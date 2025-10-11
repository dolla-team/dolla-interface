import Modal from "@/components/modal";
import Button from "@/components/button";
import Market from "@/views/profile/components/market";
import { BASE_TOKEN } from "@/config/btc";
import { useAuth } from "@/contexts/auth";
import dayjs from "@/libs/dayjs";
import Big from "big.js";
import ModalClose from "@/components/button/modal-close";
import { useNavigate } from "react-router-dom";

export default function SuccessModal({
  open,
  data,
  onClose
}: {
  open: boolean;
  data: any;
  onClose: () => void;
}) {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[388px] relative h-[430px]">
        <ModalClose
          onClose={onClose}
          className="absolute right-[16px] top-[16px]"
        />
        <div className="bg-white h-[130px] flex flex-col items-center rounded-t-[20px]">
          <img
            src="/create-success.gif"
            className="w-[60px] h-[60px] mt-[10px]"
            alt="success"
          />
          <div className="text-[16px] text-black font-[500]">
            New Market Created
          </div>
        </div>
        <div className="w-[103px] h-[32px] rounded-[16px] bg-[#1A1E24] absolute z-[2] left-[50%] translate-x-[-50%] top-[100px] text-[16px] text-white flex items-center justify-center">
          #{data?.pool_id}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="388"
          height="329"
          viewBox="0 0 388 329"
          fill="none"
          className="absolute bottom-0 left-0"
        >
          <path
            d="M0 0C0 0 41.5 15.5 194 15.5C346.5 15.5 388 0 388 0L388 308.5C388 319.546 379.046 328.5 368 328.5H20.0002C8.95456 328.5 0.000237486 319.546 0.000229277 308.5L0 0Z"
            fill="#FFC42F"
          />
        </svg>
        <Market
          data={{
            accumulative_bids: 0,
            anchor_price: 0,
            reward_amount: Big(data?.amount || 0)
              .mul(10 ** BASE_TOKEN.decimals)
              .toFixed(0),
            reward_token_info: [
              {
                decimals: BASE_TOKEN.decimals,
                symbol: BASE_TOKEN.symbol
              }
            ],
            pool_id: data?.pool_id,
            pool_user_info: {
              icon: userInfo?.icon,
              email: userInfo?.show_email,
              name: userInfo?.name,
              user: userInfo?.user
            },
            status: 1,
            participants: 0
          }}
          footer={
            <div className="mt-[10px] w-full px-[13px] bg-black rounded-b-[20px] py-[17px] text-white text-[12px] leading-[100%]">
              {dayjs().format("HH:mm D MMM, YYYY")}
            </div>
          }
          className="absolute bottom-[-20px] left-[50%] translate-x-[-50%] z-[2] w-[301px] h-[171px]"
        />
        <div className="absolute bottom-0 left-0 z-[2] w-full h-[88px] !bg-black rounded-b-[20px] flex items-center justify-center">
          <Button
            className="!bg-[#FFC42F] w-[206px] h-[40px]"
            onClick={() => navigate(`/portfolio/seller`)}
          >
            View
          </Button>
        </div>
      </div>
    </Modal>
  );
}
