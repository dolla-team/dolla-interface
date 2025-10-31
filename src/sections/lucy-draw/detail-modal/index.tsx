import LuckyDrawModal from "../lucky-draw-modal";
import DetailModalPanel from "./panel";
import LucyDrawHistoryPanel from "../history/panel";
import { useState } from "react";

export default function DetailModal({ open, onClose, ...rest }: any) {
  const [panel, setPanel] = useState<any>("detail");

  const handleClose = () => {
    setPanel("detail");
    onClose();
  };
  return (
    <LuckyDrawModal open={open} onClose={handleClose} status={rest.status || 0}>
      {panel === "detail" && (
        <DetailModalPanel
          onClose={handleClose}
          {...rest}
          onChangePanel={setPanel}
        />
      )}
      {panel === "history" && (
        <LucyDrawHistoryPanel
          {...rest}
          onClose={handleClose}
          onChangePanel={setPanel}
        />
      )}
    </LuckyDrawModal>
  );
}
