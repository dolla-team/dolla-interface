import Modal from "@/components/modal";
import Round from "./round";

export default function LuckyDrawModal({
  open,
  onClose,
  children,
  status
}: any) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="relative w-[500px]">
        <div className="absolute top-[-90px] left-[90px] w-[57px] h-[41px] bg-[url('/lucky-draw/one-ticket-icon.png')] bg-no-repeat bg-center bg-contain" />
        <div className="absolute top-[-80px] right-[70px] w-[114px] h-[109px] bg-[url('/lucky-draw/two-tickets-icon.png')] bg-no-repeat bg-center bg-contain" />
        <Round
          status={status}
          size={254}
          className="absolute left-1/2 -translate-x-1/2 top-[-90px]"
        />
        <div
          className="relative w-full rounded-[20px] border border-[#7301F5]"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 1.68%, #7200F3 0%, rgba(114, 0, 243, 0.00) 100%), #000"
          }}
        >
          {children}
        </div>
      </div>
    </Modal>
  );
}
