import HowItWorkModal from "./modal";
import useDocsStore from "@/stores/use-docs";

export default function HowItWork() {
  const { set } = useDocsStore();
  return (
    <>
      <button
        className="text-[12px] text-[#8A87AA] button fixed bottom-[10px] left-[10px] z-[10]"
        onClick={() => set({ showModal: true })}
      >
        How it works?
      </button>
      <HowItWorkModal />
    </>
  );
}
