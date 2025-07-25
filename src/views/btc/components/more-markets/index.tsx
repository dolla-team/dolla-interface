import Markets from "./markets";
import MoreMarketBtn from "./btn";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function MoreMarkets() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {!open && (
        <MoreMarketBtn
          className="absolute left-[50%] translate-x-[-50%] top-0 z-[5]"
          onClick={(e: any) => {
            e.stopPropagation();
            setOpen(true);
          }}
        />
      )}
      <AnimatePresence>
        {open && <Markets onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
