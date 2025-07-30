import Modal from "@/components/modal";
import Index from "./index";
import clsx from "clsx";

const ClaimModal = (props: any) => {
  const { className, open, onClose, ...restProps } = props;

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className={clsx("w-[672px] h-[444px] max-md:w-full flex flex-col items-stretch rounded-[16px] border border-[#6A5D3A] bg-[#35302B] max-md:rounded-b-[0]", className)}>
        <div className="w-full shrink-0 flex justify-between items-center bg-black/20 rounded-t-[10px] p-[18px_23px_16px_31px] text-white text-[20px] font-[SpaceGrotesk] font-[700] leading-[100%]">
          <div className="">Claim</div>
          <button
            type="button"
            className="button shrink-0"
            onClick={onClose}
          >
            <img src="/profile/icon-close.svg" className="w-[10px] h-[12px] shrink-0" />
          </button>
        </div>
        <div className="px-[20px] py-[18px] flex-1 h-0 max-md:px-[0px] max-md:pb-[0px]">
          <Index {...restProps} />
        </div>
      </div>
    </Modal>
  );
};

export default ClaimModal;
