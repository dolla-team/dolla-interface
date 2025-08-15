import useIsMobile from "@/hooks/use-is-mobile";
import clsx from "clsx";

export default function ResultBg() {
  const isMobile = useIsMobile();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 464 584"
      fill="none"
      preserveAspectRatio="none"
      className={clsx(
        "absolute",
        isMobile
          ? "w-[120%] h-[120%] top-[0%] left-[-10%]"
          : "w-[464px] h-[584px] top-[0px] left-[0px]"
      )}
    >
      <g filter="url(#filter0_d_1746_1693)">
        <mask
          id="path-1-outside-1_1746_1693"
          maskUnits="userSpaceOnUse"
          x="30"
          y="30"
          width="404"
          height="524"
          fill="black"
        >
          <rect fill="white" x="30" y="30" width="404" height="524" />
          <path d="M420 31C427.18 31 433 36.8203 433 44V540C433 547.18 427.18 553 420 553H44C36.8203 553 31 547.18 31 540V44C31 36.8203 36.8203 31 44 31H129.959C137.462 31 144.333 35.1983 147.756 41.8738L149.424 45.1262C152.847 51.8017 159.718 56 167.22 56H297.78C305.282 56 312.153 51.8017 315.576 45.1262L317.244 41.8738C320.667 35.1983 327.538 31 335.04 31H420Z" />
        </mask>
        <path
          d="M420 31C427.18 31 433 36.8203 433 44V540C433 547.18 427.18 553 420 553H44C36.8203 553 31 547.18 31 540V44C31 36.8203 36.8203 31 44 31H129.959C137.462 31 144.333 35.1983 147.756 41.8738L149.424 45.1262C152.847 51.8017 159.718 56 167.22 56H297.78C305.282 56 312.153 51.8017 315.576 45.1262L317.244 41.8738C320.667 35.1983 327.538 31 335.04 31H420Z"
          fill="url(#paint0_radial_1746_1693)"
          shape-rendering="crispEdges"
        />
        <path
          d="M433 44H434H433ZM433 540H434H433ZM31 540H30H31ZM31 44L30 44V44H31ZM317.244 41.8738L316.354 41.4175L317.244 41.8738ZM315.576 45.1262L316.466 45.5825L315.576 45.1262ZM149.424 45.1262L150.314 44.6699L149.424 45.1262ZM147.756 41.8738L148.646 41.4175L147.756 41.8738ZM420 31V32C426.627 32 432 37.3726 432 44H433H434C434 36.268 427.732 30 420 30V31ZM433 44H432V540H433H434V44H433ZM433 540H432C432 546.627 426.627 552 420 552V553V554C427.732 554 434 547.732 434 540H433ZM420 553V552H44V553V554H420V553ZM44 553V552C37.3726 552 32 546.627 32 540H31H30C30 547.732 36.268 554 44 554V553ZM31 540H32V44H31H30V540H31ZM31 44L32 44C32 37.3726 37.3726 32 44 32V31V30C36.268 30 30 36.268 30 44L31 44ZM44 31V32H129.959V31V30H44V31ZM147.756 41.8738L146.866 42.3301L148.534 45.5825L149.424 45.1262L150.314 44.6699L148.646 41.4175L147.756 41.8738ZM167.22 56V57H297.78V56V55H167.22V56ZM315.576 45.1262L316.466 45.5825L318.134 42.3301L317.244 41.8738L316.354 41.4175L314.686 44.6699L315.576 45.1262ZM335.04 31V32H420V31V30H335.04V31ZM317.244 41.8738L318.134 42.3301C321.386 35.9884 327.914 32 335.04 32V31V30C327.163 30 319.949 34.4082 316.354 41.4175L317.244 41.8738ZM297.78 56V57C305.657 57 312.872 52.5918 316.466 45.5825L315.576 45.1262L314.686 44.6699C311.434 51.0116 304.907 55 297.78 55V56ZM149.424 45.1262L148.534 45.5825C152.128 52.5918 159.343 57 167.22 57V56V55C160.093 55 153.566 51.0116 150.314 44.6699L149.424 45.1262ZM129.959 31V32C137.086 32 143.614 35.9884 146.866 42.3301L147.756 41.8738L148.646 41.4175C145.051 34.4082 137.837 30 129.959 30V31Z"
          fill="url(#paint1_linear_1746_1693)"
          mask="url(#path-1-outside-1_1746_1693)"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_1746_1693"
          x="0"
          y="0"
          width="464"
          height="584"
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
          <feGaussianBlur stdDeviation="15" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1746_1693"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1746_1693"
            result="shape"
          />
        </filter>
        <radialGradient
          id="paint0_radial_1746_1693"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(232 31) rotate(90) scale(283.722 273.124)"
        >
          <stop stopColor="#715B47" />
          <stop offset="1" stopColor="#0A070B" />
        </radialGradient>
        <linearGradient
          id="paint1_linear_1746_1693"
          x1="232"
          y1="31"
          x2="232"
          y2="503.871"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C79E5C" />
          <stop offset="1" stopColor="#614D2D" stopOpacity="0.58" />
        </linearGradient>
      </defs>
    </svg>
  );
}
