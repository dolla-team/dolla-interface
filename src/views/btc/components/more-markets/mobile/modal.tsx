import Modal from "@/components/modal";
import Index from "./index";
import { useBtcContext } from "@/views/btc/context";

const MarketsModal = (props: any) => {
  const {} = props;

  const { mobileMarketsOpen, onMobileMarketsClose } = useBtcContext();

  return (
    <Modal
      open={mobileMarketsOpen}
      onClose={onMobileMarketsClose}
      className="w-full h-full"
    >
      <Index {...props} />
    </Modal>
  );
};

export default MarketsModal;
