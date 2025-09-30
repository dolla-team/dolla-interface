import useCopy from "@/hooks/use-copy";
import { useNavigate } from "react-router-dom";

export function ShareBtn() {
  const { onCopy } = useCopy();
  return (
    <button
      className="w-[30px] h-[30px] button"
      onClick={() => {
        onCopy(window.location.href);
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
  );
}

export function CloseBtn() {
  const navigate = useNavigate();
  return (
    <button
      className="flex items-center button border border-[#3B3951] bg-[#FFFFFF1A] rounded-[8px] px-[10px] py-[6px] gap-[6px]"
      onClick={() => {
        navigate(-1);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="12"
        viewBox="0 0 13 12"
        fill="none"
      >
        <path
          d="M11.5 1L1.5 11"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M1.5 1L11.5 11"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[#FFFFFF] text-[12px]">Close</span>
    </button>
  );
}
