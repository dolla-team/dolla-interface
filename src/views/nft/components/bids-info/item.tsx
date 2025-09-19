import Avatar from "@/components/avatar";
import { formatAddress } from "@/utils/format/address";
import dayjs from "dayjs";

export default function Item({ data }: any) {
  return (
    <div className="relative h-[46px] shrink-0 bg-linear-to-r from-[#FFFFFF]/60 to-[#FFFFFF00] rounded-l-[24px]">
      <Bg index={data?.user + data?.time} />
      <div className="h-full p-[6px] inline-flex items-center text-[#3B3951] relative z-[2]">
        <Avatar
          address={data.user}
          email={data.user_email}
          size={30}
          className="border border-[#131417] mr-[6px] rounded-full"
        />
        <div className="text-[12px] truncate mr-[3px] shrink-0">
          {formatAddress(data.user, 3)}
        </div>
        <div className="text-[12px] font-bold mr-[3px]">bid ${data.times}</div>
        <div className="text-[12px]">{dayjs(data.time * 1000).fromNow()}</div>
      </div>
    </div>
  );
}

const Bg = ({ index }: { index: string }) => {
  return (
    <svg
      width="100%"
      height="46"
      viewBox="0 0 256 46"
      fill="none"
      preserveAspectRatio="none"
      className="absolute top-0 left-0  rounded-[24px]"
    >
      <foreignObject x="-20" y="-20" width="296" height="86">
        <div
          style={{
            backdropFilter: "blur(10px)",
            clipPath: "url(#bgblur_0_2963_6534_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <path
        data-figma-bg-blur-radius="20"
        d="M23 0.5H233C245.426 0.5 255.5 10.5736 255.5 23C255.5 35.4264 245.426 45.5 233 45.5H23C10.5736 45.5 0.5 35.4264 0.5 23C0.5 10.5736 10.5736 0.5 23 0.5Z"
        fill={`url(#paint0_linear_2963_6534_${index})`}
        fillOpacity="0.3"
        stroke={`url(#paint1_linear_2963_6534_${index})`}
      />
      <defs>
        <clipPath
          id={`bgblur_0_2963_6534_clip_path_${index}`}
          transform="translate(20 20)"
        >
          <path d="M23 0.5H233C245.426 0.5 255.5 10.5736 255.5 23C255.5 35.4264 245.426 45.5 233 45.5H23C10.5736 45.5 0.5 35.4264 0.5 23C0.5 10.5736 10.5736 0.5 23 0.5Z" />
        </clipPath>
        <linearGradient
          id={`paint1_linear_2963_6534_${index}`}
          x1="256"
          y1="23"
          x2="0"
          y2="23"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E4E4E400" stopOpacity="0" />
          <stop offset="1" stopColor="#E4E4E4" />
        </linearGradient>
      </defs>
    </svg>
  );
};
