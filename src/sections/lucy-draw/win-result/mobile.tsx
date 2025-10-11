import Modal from "@/components/modal";
import WinResultContent from "./content";

export default function WinResultMobile({
  currentWinner,
  isClaiming,
  claim,
  onShowHistory
}: any) {
  return (
    <Modal
      open={currentWinner}
      isForceNormal={true}
      className="w-full !bg-transparent"
    >
      <div className="w-[274px] h-[197px] rounded-[12px] bg-linear-to-b from-[#4FFF61] to-[#2F993A] text-black py-[6px] px-[10px] mb-[10px]">
        <WinResultContent
          onShowHistory={onShowHistory}
          isClaiming={isClaiming}
          currentWinner={currentWinner}
          claim={claim}
        />
      </div>
    </Modal>
  );
}
