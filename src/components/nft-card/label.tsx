import clsx from "clsx";

const TYPES: Record<
  string,
  { text: string; colors: string[]; border: string }
> = {
  saudi: {
    text: "SAUDI",
    border: "#CA9F4E",
    colors: ["#FBFFDD", "#FFE69A", "#FFFFF1", "#FFE484", "#FDFFB5"]
  },
  redOg: {
    text: "RED OG",
    border: "#8C4ECA",
    colors: ["#ECDDFF", "#CBBBFF", "#ECDDFF", "#CBBBFF", "#ECDDFF"]
  }
};

export default function Label({ type, id }: { type: string; id: string }) {
  if (type === "basic") return null;
  const item = TYPES[type];

  return (
    <div className="absolute top-[4px] z-[5] left-[4px] w-[65px] h-[29px] flex justify-center items-center">
      <span
        className={clsx(
          "text-[10px]  font-bold italic relative z-[1]",
          type === "saudi" ? "text-[#674911]" : "text-[#4C1167]"
        )}
      >
        {item.text}
      </span>
      <Bg border={item.border} colors={item.colors} id={id} />
    </div>
  );
}

const Bg = ({ border, colors, id }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="65"
      height="29"
      viewBox="0 0 65 29"
      fill="none"
      className="absolute top-0 left-0"
    >
      <g filter={`url(#filter0_d_2932_3541_${id})`}>
        <path
          d="M9.68162 6.39889C9.94401 5.56625 10.7161 5 11.5892 5H58.4156C59.7669 5 60.7293 6.31231 60.3232 7.60111L55.4612 23.0297C55.1988 23.8623 54.4267 24.4286 53.5537 24.4286H6.72721C5.37592 24.4286 4.41354 23.1163 4.81968 21.8275L9.68162 6.39889Z"
          fill={`url(#paint0_linear_2932_3541_${id})`}
        />
        <path
          d="M58.416 4.75C59.9359 4.75024 61.0181 6.22612 60.5615 7.67578L55.6992 23.1045C55.404 24.0412 54.5358 24.6787 53.5537 24.6787H6.72754C5.20735 24.6787 4.12415 23.2019 4.58105 21.752L9.44336 6.32422C9.73852 5.38759 10.6069 4.75012 11.5889 4.75H58.416Z"
          stroke={border}
          strokeWidth="0.5"
        />
      </g>
      <defs>
        <filter
          id={`filter0_d_2932_3541_${id}`}
          x="0.225464"
          y="0.5"
          width="64.692"
          height="28.4286"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2932_3541"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2932_3541"
            result="shape"
          />
        </filter>
        <linearGradient
          id={`paint0_linear_2932_3541_${id}`}
          x1="30.0389"
          y1="5"
          x2="30.0389"
          y2="24.4286"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={colors[0]} />
          <stop offset="0.197115" stopColor={colors[1]} />
          <stop offset="0.514423" stopColor={colors[2]} />
          <stop offset="0.774038" stopColor={colors[3]} />
          <stop offset="1" stopColor={colors[4]} />
        </linearGradient>
      </defs>
    </svg>
  );
};
