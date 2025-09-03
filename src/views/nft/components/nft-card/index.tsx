import { useNftContext } from "../../context";
import Bids from "./bids";
import Bg from "./bg";

export default function NftCard({
  probability,
  rewardTokenInfo
}: {
  probability: number;
  rewardTokenInfo: any;
}) {
  const { pool, bids } = useNftContext();

  return (
    <div
      className="w-[444px] h-[782px] shrink-0 relative z-[1] top-[-30px] left-[-30px]"
      key={pool?.id}
    >
      {pool && <Bids rare={pool?.rare} bids={bids} />}
      <img
        src={rewardTokenInfo?.icon}
        className="w-[430px] h-[430px] absolute z-[3] left-[38px] top-[50%] translate-y-[-50%]"
      />
      <div className="absolute bottom-[120px] left-[30px] z-[6] text-white font-bold w-full text-center">
        <span className="text-[20px]">Probability</span>{" "}
        <span className="text-[26px]">~{probability}%</span>
      </div>
      <Bg rare={pool?.rare} />
      <LeftLight />
      <RightLight />
    </div>
  );
}

const LeftLight = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="627"
      viewBox="0 0 42 627"
      fill="none"
      className="absolute left-[38px] top-[110px] z-[5]"
    >
      <g opacity="0.6" filter="url(#filter0_f_3488_1881)">
        <path
          d="M4.10502 622.45L4.0999 4.5498L27.8881 26.8032C33.9518 32.4757 37.3933 40.4076 37.3934 48.711L37.3998 568.016C37.3999 574.502 35.298 580.813 31.4093 586.004L4.10502 622.45Z"
          fill="url(#paint0_linear_3488_1881)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_3488_1881"
          x="0.100098"
          y="0.549805"
          width="41.2998"
          height="625.9"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="2"
            result="effect1_foregroundBlur_3488_1881"
          />
        </filter>
        <linearGradient
          id="paint0_linear_3488_1881"
          x1="3.24536"
          y1="187.7"
          x2="42.0954"
          y2="187.7"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.15" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const RightLight = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="42"
      height="601"
      viewBox="0 0 42 601"
      fill="none"
      className="absolute right-[-26px] top-[110px] z-[5]"
    >
      <g filter="url(#filter0_f_3488_1880)">
        <path
          d="M27.3293 594.831C31.0326 598.848 37.7408 596.228 37.7408 590.764L37.7457 10.379C37.7457 5.12941 31.4804 2.41099 27.6467 5.99727L10.7892 21.7671C6.74676 25.5488 4.45244 30.8368 4.45237 36.3723L4.4459 562.195C4.44584 567.219 6.33609 572.058 9.74087 575.751L27.3293 594.831Z"
          fill="url(#paint0_linear_3488_1880)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_3488_1880"
          x="0.445801"
          y="0.367035"
          width="41.2998"
          height="600.409"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="2"
            result="effect1_foregroundBlur_3488_1880"
          />
        </filter>
        <linearGradient
          id="paint0_linear_3488_1880"
          x1="38.6003"
          y1="179.7"
          x2="-0.249657"
          y2="179.7"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.15" />
        </linearGradient>
      </defs>
    </svg>
  );
};
