import Modal from "@/components/modal";
import Button from "@/components/button";
import ModalClose from "@/components/button/modal-close";
import useCreate from "@/hooks/near/use-create";
import { formatNumber } from "@/utils/format/number";
import { BASE_TOKEN } from "@/config/btc";

export default function ConfirmModal({
  open,
  amount,
  pricePerBTC,
  onSuccess,
  onClose
}: {
  open: boolean;
  amount: number;
  pricePerBTC: number;
  onSuccess: (id: string) => void;
  onClose: () => void;
}) {
  const { create: onCreate, loading: creating } = useCreate(onSuccess);

  return (
    <Modal open={open}>
      <div className="w-[388px] relative h-[266px] bg-white rounded-[20px]">
        <ModalClose
          onClose={onClose}
          className="absolute right-[16px] top-[16px]"
        />
        <div className="text-[16px] text-black font-[500] pt-[50px] h-[91px] text-center">
          Create New Market
        </div>
        <div className="relative z-[2] flex flex-col items-center mt-[30px]">
          <div className="text-[14px] text-black text-center w-[332px]">
            Your are creating a{" "}
            <span className="text-[16px] font-[700]">
              {amount} {BASE_TOKEN.symbol}
            </span>{" "}
            sell market, valued ${formatNumber(amount * pricePerBTC, 2, true)}
          </div>
          <div className="flex gap-[13px] mt-[26px]">
            <Button
              className="!bg-[transparent] !text-black border border-[#383F47] w-[168px] h-[40px]"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="!bg-black !text-white w-[168px] h-[40px]"
              loading={creating}
              onClick={() => {
                onCreate({
                  amount: amount.toString(),
                  price: pricePerBTC
                });
              }}
            >
              Create
            </Button>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="388"
          height="176"
          viewBox="0 0 388 176"
          fill="none"
          className="absolute bottom-[-1px] left-0"
        >
          <path
            d="M0 0C0 0 41.5 15.5 194 15.5C346.5 15.5 388 0 388 0L388 155.5C388 166.546 379.046 175.5 368 175.5H20.0002C8.95454 175.5 0.000231684 166.546 0.000216318 155.5L0 0Z"
            fill="#FFC42F"
          />
        </svg>
      </div>
    </Modal>
  );
}
