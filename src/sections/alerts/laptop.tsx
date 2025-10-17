import ReactDOM from "react-dom";
import { useGlobalStore } from "@/stores/use-global";
import { AnimatePresence } from "framer-motion";
import LucyDrawAlert from "@/sections/lucy-draw/win-result";
import CancelAlert from "./cancel";

export default function Alerts({}: any) {
  const globalStore = useGlobalStore();
  return ReactDOM.createPortal(
    <AnimatePresence>
      <div
        className="fixed bottom-[10px] right-[10px] z-[50] flex flex-col gap-[10px]"
        style={{ right: globalStore.showUserInfo ? "300px" : "10px" }}
      >
        <CancelAlert />
        <LucyDrawAlert />
      </div>
    </AnimatePresence>,
    document.body
  );
}
