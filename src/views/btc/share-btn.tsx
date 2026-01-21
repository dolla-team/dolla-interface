import ShareModal from "@/sections/share";
import { useBtcContext } from "./context";
import { useState } from "react";
import useShareData from "../btc-detail/use-share-data";

export function ShareBtn() {
  const { pool } = useBtcContext();
  const [open, setOpen] = useState(false);
  const data = useShareData();

  return (
    <>
      <button
        className="w-[30px] h-[30px] button"
        onClick={() => {
          setOpen(true);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
        >
          <foreignObject x="-50" y="-50" width="132" height="132">
            <div
              style={{
                backdropFilter: "blur(25px)",
                clipPath: "url(#bgblur_0_4184_1279_clip_path)",
                height: "100%",
                width: "100%"
              }}
            ></div>
          </foreignObject>
          <rect
            data-figma-bg-blur-radius="50"
            x="0.5"
            y="0.5"
            width="31"
            height="31"
            rx="8.5"
            fill="white"
            fillOpacity="0.1"
            stroke="#3B3951"
          />
          <path
            d="M10 18.2333V23H22V18.2333M15.8065 19.1V10M15.8065 10L12.3226 13.0333M15.8065 10L19.2903 13.0333"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <clipPath
              id="bgblur_0_4184_1279_clip_path"
              transform="translate(50 50)"
            >
              <rect x="0.5" y="0.5" width="31" height="31" rx="8.5" />
            </clipPath>
          </defs>
        </svg>
      </button>
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

export function CloseBtn() {
  const { setShowDetail } = useBtcContext();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      className="button"
      onClick={() => {
        setShowDetail(true);
      }}
    >
      <rect
        data-figma-bg-blur-radius="50"
        x="0.5"
        y="0.5"
        width="37"
        height="37"
        rx="12.5"
        fill="white"
        fillOpacity="0.1"
        stroke="#3B3951"
      />
      <path
        d="M24.4761 13.522L13.5195 24.4785"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13.52 13.522L24.4766 24.4785"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <clipPath
          id="bgblur_0_6243_16590_clip_path"
          transform="translate(50 50)"
        >
          <rect x="0.5" y="0.5" width="37" height="37" rx="12.5" />
        </clipPath>
      </defs>
    </svg>
  );
}
