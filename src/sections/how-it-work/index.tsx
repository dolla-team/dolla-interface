import { useState } from "react";
import HowItWorkModal from "./modal";

export default function HowItWork() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        className="text-[12px] text-[#8A87AA] button fixed bottom-[10px] left-[10px] z-[10]"
        onClick={() => setShowModal(true)}
      >
        How it works?
      </button>
      <HowItWorkModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
}
