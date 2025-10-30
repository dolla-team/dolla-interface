import LucyDrawHistoryPanel from "./panel";
import LuckyDrawModal from "../lucky-draw-modal";

export default function LucyDrawHistory({
  open,
  onClose,
  status,
  ...rest
}: any) {
  return (
    <LuckyDrawModal open={open} onClose={onClose} status={0}>
      <LucyDrawHistoryPanel {...rest} onClose={onClose} />
    </LuckyDrawModal>
  );
}
