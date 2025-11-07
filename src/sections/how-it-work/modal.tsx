import Button from "@/components/button";
import Modal from "@/components/modal";

export default function HowItWorkModal({
  showModal,
  setShowModal
}: {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}) {
  return (
    <Modal open={showModal} onClose={() => setShowModal(false)}>
      <div className="rounded-[16px] border border-[#E4E4E4] bg-white w-[730px]">
        <div className="h-[54px] bg-[#000000] rounded-t-[16px] flex items-center justify-between px-[30px]">
          <div className="text-[16px] text-white font-[600]">How it works</div>
        </div>
        <div className="p-[20px]">
          <div className="text-[16px] text-[#5E6B7D] font-[300]">
            Dolla allows <span className="text-black font-[600]">anyone</span>{" "}
            to list assets through a{" "}
            <span className="text-black font-[600]">fair</span>, on-chain
            <span className="text-black font-[600]"> probabilistic market</span>
            .
          </div>
          <div className="text-[16px] text-[#5E6B7D] font-[300]">
            Every <span className="text-black font-[600]">$1 bid</span> = one
            verifiable chance to win the entire asset from the seller.
          </div>
          <div className="rounded-[16px] bg-black p-[16px] mt-[16px]">
            <div className="flex gap-[4px]">
              <span className="text-[16px] text-[#FFC42F] font-[600] w-[80px] shrink-0">
                Step 1.{" "}
              </span>
              <span className="text-[16px] text-white font-[300]">
                Pick a market you like
              </span>
            </div>
            <div className="flex gap-[4px] mt-[10px]">
              <span className="text-[16px] text-[#FFC42F] font-[600] w-[80px] shrink-0">
                Step 2.{" "}
              </span>
              <span className="text-[16px] text-white font-[300]">
                Place your bid — each bid = 1 USD = one verifiable chance
              </span>
            </div>
            <div className="flex gap-[4px] mt-[10px]">
              <span className="text-[16px] text-[#FFC42F] font-[600] w-[80px] shrink-0">
                Step 3.{" "}
              </span>
              <span className="text-[16px] text-white font-[300]">
                If you win, you receive the asset instantly. If not, you can bid
                again or explore other markets
              </span>
            </div>
          </div>
          <div className="text-[16px] text-[#5E6B7D] font-[300] mt-[10px]">
            All bids are processed through{" "}
            <span className="text-black font-[600]">
              verifiable on-chain randomness
            </span>{" "}
            (TEE + smart-contract validation).
          </div>
          <div className="text-[16px] text-[#5E6B7D] font-[300]">
            No hidden odds, no unfair advantage — just mathematically fair
            markets for everyone.
          </div>
          <div className="flex justify-center relative mt-[10px]">
            <button
              className="button text-[#2B3337] absolute left-0 top-[10px]"
              onClick={() => {
                window.open(window.location.origin + "/docs", "_blank");
              }}
            >
              Read more
            </button>
            <Button
              onClick={() => setShowModal(false)}
              className="w-[208px] h-[40px] rounded-[12px] !text-[14px] !text-black !font-[600] !bg-radial-[50%_50%_at_50%_50%,_#FFB700_0%,_#FFCE54_100%] shadow-[0_0_10px_0_#FFCE52]"
            >
              I’m ready to win
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
