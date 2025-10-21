const COLOR: Record<number, { border: string[]; bg: string[] }> = {
  1: {
    border: ["#FFBF48", "#774E00"],
    bg: ["#FFE586", "#D3902C"]
  },
  2: {
    border: ["#C5D2EC", "#797D85"],
    bg: ["#FFFFFF", "#A29DC8"]
  },
  3: {
    border: ["#FEC3A9", "#B26B40"],
    bg: ["#F3C7B1", "#F38779"]
  },
  4: {
    border: ["#000000", "#000000"],
    bg: ["#FFFFFF", "#FFFFFF"]
  },
  5: {
    border: ["#000000", "#000000"],
    bg: ["#FFFFFF", "#FFFFFF"]
  }
};

export default function ItemLevel({
  level = 0,
  className
}: {
  level: number;
  className?: string;
}) {
  if (level > 5 || !level) return null;
  const { border, bg } = COLOR[level];
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
      >
        <path
          d="M11.8193 1.69629C12.4199 0.930048 13.5801 0.93005 14.1807 1.69629L16.2969 4.39844C16.4048 4.53625 16.5772 4.60706 16.751 4.58594L20.1572 4.17285C21.124 4.05537 21.9446 4.87597 21.8271 5.84277L21.4141 9.24902C21.3929 9.42281 21.4637 9.59517 21.6016 9.70312L24.3037 11.8193C25.07 12.4199 25.0699 13.5801 24.3037 14.1807L21.6016 16.2969C21.4637 16.4048 21.3929 16.5772 21.4141 16.751L21.8271 20.1572C21.9446 21.124 21.124 21.9446 20.1572 21.8271L16.751 21.4141C16.5772 21.3929 16.4048 21.4637 16.2969 21.6016L14.1807 24.3037C13.5801 25.07 12.4199 25.0699 11.8193 24.3037L9.70312 21.6016C9.59517 21.4637 9.42281 21.3929 9.24902 21.4141L5.84277 21.8271C4.87597 21.9446 4.05537 21.124 4.17285 20.1572L4.58594 16.751C4.60706 16.5772 4.53626 16.4048 4.39844 16.2969L1.69629 14.1807C0.930048 13.5801 0.93005 12.4199 1.69629 11.8193L4.39844 9.70312C4.53625 9.59517 4.60706 9.42281 4.58594 9.24902L4.17285 5.84277C4.05537 4.87597 4.87597 4.05537 5.84277 4.17285L9.24902 4.58594C9.42281 4.60706 9.59517 4.53626 9.70312 4.39844L11.8193 1.69629Z"
          fill={`url(#paint0_linear_3488_1265_${level})`}
          stroke={`url(#paint1_linear_3488_1265_${level})`}
        />
        <defs>
          <linearGradient
            id={`paint0_linear_3488_1265_${level}`}
            x1="13"
            y1="1"
            x2="13"
            y2="25"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={bg[0]} />
            <stop offset="1" stopColor={bg[1]} />
          </linearGradient>
          <linearGradient
            id={`paint1_linear_3488_1265_${level}`}
            x1="13"
            y1="1"
            x2="13"
            y2="25"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={border[0]} />
            <stop offset="1" stopColor={border[1]} />
          </linearGradient>
        </defs>
      </svg>
      <div className="w-[26px] h-[26px] flex items-center justify-center absolute top-0 left-0 text-[10px] font-semibold">
        {level}
      </div>
    </div>
  );
}
