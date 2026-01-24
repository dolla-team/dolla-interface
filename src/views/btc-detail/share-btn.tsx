import ShareButton from "@/components/button/share-button";
import ShareModal from "@/sections/share";
import { useBtcContext } from "../btc/context";
import { useState } from "react";
import useShareData from "./use-share-data";

export default function ShareBtn() {
  const { pool } = useBtcContext();
  const [open, setOpen] = useState(false);
  const data = useShareData();

  return (
    <>
      <ShareButton onClick={() => setOpen(true)} />
      {!!data && (
        <ShareModal
          open={open}
          onClose={() => setOpen(false)}
          type={pool.status === 2 ? "winner" : "pool"}
          data={data}
        />
      )}
    </>
  );
}
