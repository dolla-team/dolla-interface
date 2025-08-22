import { useMemo } from "react";

export default function ProbabilityBar({
  probability,
  probabilities
}: {
  probability: number;
  probabilities: number[];
}) {
  const [colors, width] = useMemo(() => {
    let index = 0;
    let diff = 0;
    probabilities.forEach((item, i) => {
      if (probability >= item) {
        diff =
          ((probability - item) / (probabilities[i + 1] - item)) * 425 * 0.25;
        index = i;
      }
    });

    if (index === 0) {
      return [["#10FFBF", "#966DFF"], 425 * 0.25 + diff];
    }
    if (index === 1) {
      return [["#F098FF", "#AB96FF"], 425 * 0.5 + diff];
    }
    if (index === 2) {
      return [["#BFA6FF", "#FF7F9F"], 425 * 0.75 + diff];
    }
    if (index === 3) {
      return [["#FFDAAD", "#FF3B3E"], 425];
    }

    return [["#10FFBF", "#966DFF"], 425];
  }, [probability, probabilities]);

  return (
    <div className="relative w-[442px] h-[38px]">
      <Bar
        color="#171717"
        borderColor="#464646"
        className="absolute top-[7px] left-[5px] z-[2]"
        width="425px"
      />
      <Bar
        color={colors[0]}
        borderColor={colors[1]}
        className="absolute top-[7px] left-[5px] z-[3]"
        width={width}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="440"
        height="42"
        viewBox="0 0 440 42"
        fill="none"
        className="absolute left-0 top-0 z-[1]"
      >
        <path
          d="M430.775 8.13176C429.737 4.5449 426.355 2.15342 422.627 2.36965L8.67612 26.3807C3.70007 26.6694 0.70694 32.0272 3.07004 36.4158C4.25873 38.6234 6.56351 40 9.07077 40H429.356C434.682 40 438.521 34.8921 437.04 29.7755L430.775 8.13176Z"
          fill="url(#paint0_linear_2963_6555)"
          fillOpacity="0.2"
        />
        <path
          d="M422.569 1.37109L8.61816 25.3828C2.91214 25.7138 -0.520122 31.8572 2.18945 36.8896C3.55248 39.421 6.19534 40.9998 9.07031 41H429.355C435.348 41 439.667 35.2532 438.001 29.4971L431.735 7.85352C430.567 3.81843 426.763 1.12786 422.569 1.37109Z"
          stroke="url(#paint1_linear_2963_6555)"
          strokeOpacity="0.6"
          strokeWidth="2"
        />
        <defs>
          <linearGradient
            id="paint0_linear_2963_6555"
            x1="363.5"
            y1="4.26667"
            x2="363.5"
            y2="70"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#DEDEDE" />
            <stop offset="1" stopColor="#555555" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_2963_6555"
            x1="363.5"
            y1="4.26667"
            x2="363.5"
            y2="70"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9F9F9F" />
            <stop offset="1" stopColor="#323232" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

const Bar = ({ color, className, width, borderColor }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height="29"
      viewBox="0 0 426 29"
      fill="none"
      preserveAspectRatio="xMinYMin slice"
      className={className}
    >
      <path
        d="M413.585 0.767578L2.77832 24.3965C1.549 24.4674 0.750911 25.7228 1.20801 26.8662C1.48177 27.5507 2.14473 27.9999 2.88184 28H418.552C422.962 27.9999 426.092 23.7019 424.738 19.5049L420.145 5.26172C419.236 2.44509 416.54 0.597708 413.585 0.767578Z"
        fill={color}
        stroke={`url(#paint0_linear_2963_6557_${borderColor})`}
      />
      <defs>
        <linearGradient
          id={`paint0_linear_2963_6557_${borderColor}`}
          x1="213.896"
          y1="27.5"
          x2="213.896"
          y2="1"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={borderColor} />
          <stop offset="1" />
        </linearGradient>
      </defs>
    </svg>
  );
};
