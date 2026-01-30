import Avatar from "@/components/avatar";
import { useBtcContext } from "@/views/btc/context";
import MultipleTag from "@/components/multiple-tag";
import { formatNumber } from "@/utils/format/number";
import { formatAddress } from "@/utils/format/address";
import { motion } from "framer-motion";

export default function WinnerInfo({
  totalBids,
  totalTimes
}: {
  totalBids: number;
  totalTimes: number;
}) {
  const { pool } = useBtcContext();
  return (
    <div className="w-full h-[436px] rounded-[22px] bg-white border border-[#E4E4E4] relative overflow-hidden">
      <Bg />
      <LightBg />
      <div className="relative z-[3] top-0 left-0">
        <div className="text-[16px] font-[600] text-black pl-[26px] pt-[16px]">Winner</div>
        <div className="absolute left-0 top-[100px] w-full flex justify-center flex-col items-center">
          <div className="relative w-[158px] h-[158px] rounded-full p-[4px] bg-linear-to-b from-[#FFE8AC] to-[#99761C]">
            <Avatar
              className="rounded-full"
              size={150}
              src={pool?.winner_user_info?.icon}
              address={pool?.winner_user_info?.user}
            />
            <MultipleTag
              multipler={formatNumber(pool?.winner_profit_ratio, 1, true)}
              size={92}
              className="absolute top-[-20px] right-[-40px]"
              textClassName="text-[24px]"
            />
          </div>
          <div className="text-center text-[20px] font-[600] text-black mt-[20px] truncate max-w-[400px]">
            {pool?.winner_user_info?.name || formatAddress(pool?.winner_user_info?.user)}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full px-[24px]">
        <div className="flex items-center justify-between pb-[20px]">
          <span className="text-[#A6A4B8] text-[12px]">Winner’s bid</span>
          <span className="text-black text-[12px]">${totalBids.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between pb-[20px]">
          <span className="text-[#A6A4B8] text-[12px]">Bid times</span>
          <span className="text-black text-[12px]">{totalTimes}</span>
        </div>
        <div className="flex items-center justify-between pb-[20px]">
          <span className="text-[#A6A4B8] text-[12px]">Return multiple</span>
          <span className="text-black text-[12px]">
            ~{formatNumber(pool?.winner_profit_ratio, 0, true)}X
          </span>
        </div>
      </div>
    </div>
  )
}

const Bg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 444 195"
      fill="none"
      className="w-full absolute top-0 left-0"
    >
      <foreignObject x="-30" y="-30" width="504" height="255">
        <div
          style={{
            backdropFilter: "blur(15px)",
            clipPath: "url(#bgblur_0_6151_8774_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <path
        data-figma-bg-blur-radius="30"
        d="M443 172C443.105 172.489 443.104 172.489 443.104 172.489C443.103 172.489 443.101 172.49 443.1 172.49C443.096 172.491 443.092 172.492 443.086 172.493C443.073 172.496 443.054 172.5 443.029 172.505C442.979 172.516 442.905 172.532 442.806 172.553C442.607 172.594 442.311 172.656 441.921 172.736C441.14 172.898 439.98 173.135 438.462 173.436C435.425 174.038 430.955 174.898 425.222 175.93C413.755 177.993 397.232 180.744 377.005 183.495C336.553 188.997 281.279 194.5 222 194.5C162.721 194.5 107.447 188.997 66.9951 183.495C46.7684 180.744 30.2453 177.993 18.7783 175.93C13.0449 174.898 8.57493 174.038 5.53809 173.436C4.01996 173.135 2.85997 172.898 2.0791 172.736C1.68863 172.656 1.39251 172.594 1.19434 172.553C1.09532 172.532 1.0207 172.516 0.970703 172.505C0.945715 172.5 0.926677 172.496 0.914062 172.493C0.908112 172.492 0.903554 172.491 0.900391 172.49C0.898885 172.49 0.897285 172.489 0.896484 172.489C0.895646 172.489 0.895073 172.489 1 172L0.895508 172.489L0.5 172.404V21C0.5 9.67816 9.67816 0.5 21 0.5H423C434.322 0.5 443.5 9.67816 443.5 21V172.404L443.104 172.489L443 172Z"
        fill="#FFC42F"
        stroke="url(#paint0_linear_6151_8774)"
      />
      <defs>
        <clipPath
          id="bgblur_0_6151_8774_clip_path"
          transform="translate(30 30)"
        >
          <path d="M443 172C443.105 172.489 443.104 172.489 443.104 172.489C443.103 172.489 443.101 172.49 443.1 172.49C443.096 172.491 443.092 172.492 443.086 172.493C443.073 172.496 443.054 172.5 443.029 172.505C442.979 172.516 442.905 172.532 442.806 172.553C442.607 172.594 442.311 172.656 441.921 172.736C441.14 172.898 439.98 173.135 438.462 173.436C435.425 174.038 430.955 174.898 425.222 175.93C413.755 177.993 397.232 180.744 377.005 183.495C336.553 188.997 281.279 194.5 222 194.5C162.721 194.5 107.447 188.997 66.9951 183.495C46.7684 180.744 30.2453 177.993 18.7783 175.93C13.0449 174.898 8.57493 174.038 5.53809 173.436C4.01996 173.135 2.85997 172.898 2.0791 172.736C1.68863 172.656 1.39251 172.594 1.19434 172.553C1.09532 172.532 1.0207 172.516 0.970703 172.505C0.945715 172.5 0.926677 172.496 0.914062 172.493C0.908112 172.492 0.903554 172.491 0.900391 172.49C0.898885 172.49 0.897285 172.489 0.896484 172.489C0.895646 172.489 0.895073 172.489 1 172L0.895508 172.489L0.5 172.404V21C0.5 9.67816 9.67816 0.5 21 0.5H423C434.322 0.5 443.5 9.67816 443.5 21V172.404L443.104 172.489L443 172Z" />
        </clipPath>
        <linearGradient
          id="paint0_linear_6151_8774"
          x1="222"
          y1="21"
          x2="222"
          y2="192"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E4E4E4" />
          <stop offset="1" stopColor="#E4E4E4" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const LightBg = () => {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="341"
      height="341"
      viewBox="0 0 341 341"
      fill="none"
      className="absolute top-0 left-[50px] z-[1]"
      animate={{
        rotate: 360
      }}
      transition={{
        duration: 16,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <path
        opacity="0.5"
        d="M170.499 170.488L219.32 6.32715L249.556 18.5586L170.499 170.491L170.501 170.495L279.529 38.4062L302.593 61.4688L170.501 170.496L170.502 170.498H170.504L322.448 91.4629L334.676 121.699L170.511 170.497L341 154.192V186.808L170.503 170.5L170.506 170.502L334.672 219.326L322.439 249.561L170.511 170.506L302.594 279.529L279.531 302.593L170.505 170.504L249.543 322.451L219.306 334.68L170.503 170.503L170.502 170.502L170.5 170.501H170.502L170.501 170.5H170.5L170.501 170.499V170.497L170.499 170.499V170.5L186.807 341H154.191L170.496 170.502L170.494 170.503L121.671 334.671L91.4355 322.438L170.493 170.505L61.4688 302.593L38.4062 279.529L170.491 170.505L18.5469 249.541L6.31934 219.305L170.493 170.503L170.495 170.5L0 186.808V154.192L170.487 170.497L6.32812 121.677L18.5596 91.4414L170.493 170.497L170.496 170.498V170.495L38.4072 61.4688L61.4707 38.4062L170.497 170.494L170.496 170.488L91.4639 18.5508L121.701 6.32227L170.495 170.475L154.191 0H186.807L170.499 170.488ZM170.495 170.502H170.497V170.5H170.495V170.502ZM170.496 170.498L170.498 170.499L170.497 170.496L170.496 170.498ZM170.499 170.496L170.5 170.497V170.496L170.499 170.493V170.496Z"
        fill="url(#paint0_radial_6151_8018)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_6151_8018"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(170.5 170.5) rotate(90) scale(170.5)"
        >
          <stop stop-color="white" />
          <stop offset="1" stop-color="white" stop-opacity="0" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
};
