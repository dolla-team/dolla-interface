export default function Bg({ rare = 0 }: { rare: number }) {
  const color = COLOR[rare] || COLOR[0];
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="504"
      height="842"
      viewBox="0 0 504 842"
      fill="none"
      className="absolute top-0 left-0"
    >
      <g filter="url(#filter0_d_109_25)">
        <path
          d="M32.8844 43.5H32C30.8954 43.5 30 44.3954 30 45.5V106.3C32.4667 110.617 37.4 121.84 37.4 132.2V702C37.4 710.88 32.4667 722.967 30 727.9V793.992C30 794.54 30.2246 795.064 30.6214 795.441L46.3765 810.431C47.0377 811.06 48.0411 811.162 48.8151 810.678L66.3311 799.731C67.0349 799.291 67.9372 799.331 68.5988 799.832L82.8736 810.647C83.5488 811.158 84.4729 811.189 85.1806 810.723L101.87 799.743C102.553 799.294 103.44 799.305 104.111 799.771L119.924 810.753C120.578 811.207 121.438 811.23 122.115 810.813L137.92 801.066C138.579 800.66 139.414 800.67 140.063 801.094L154.937 810.806C155.586 811.23 156.421 811.24 157.08 810.834L173.003 801.015C173.619 800.635 174.391 800.617 175.024 800.968L193.041 810.968C193.639 811.299 194.364 811.303 194.964 810.978L213.497 800.943C214.119 800.607 214.872 800.623 215.478 800.987L231.998 810.899C232.617 811.27 233.388 811.279 234.016 810.922L251.484 800.978C252.112 800.621 252.883 800.63 253.502 801.002L269.985 810.891C270.611 811.266 271.392 811.271 272.022 810.903L288.963 801.006C289.601 800.633 290.393 800.642 291.022 801.03L306.978 810.87C307.607 811.258 308.399 811.267 309.037 810.894L325.978 800.997C326.608 800.629 327.389 800.634 328.015 801.009L345.5 811.5L364.5 800.4L382.5 811.5L401 800.4L418.436 810.862C419.088 811.253 419.905 811.241 420.544 810.83L439 799L459.5 811.5L473.216 801C473.71 800.622 474 800.035 474 799.412V794.85V737.15C472.767 734.683 469.93 731.6 468.45 724.2V130.35C468.45 117.03 472.15 106.3 474 102.6V44.3484C474 43.8062 473.78 43.2872 473.39 42.9104L461.356 31.2776C459.986 29.9531 457.872 29.7792 456.303 30.862L440.337 41.8865C438.937 42.8528 437.08 42.8286 435.706 41.8261L421.89 31.7444C420.47 30.7079 418.539 30.7205 417.133 31.7756L403.867 41.7244C402.461 42.7795 400.53 42.7921 399.11 41.7556L385.46 31.7953C384.007 30.7347 382.024 30.7751 380.615 31.8941L368.452 41.553C367.012 42.6967 364.977 42.711 363.521 41.5877L350.909 31.8585C349.486 30.7603 347.504 30.7468 346.066 31.8256L333.088 41.5591C331.578 42.6911 329.483 42.6146 328.061 41.3755L317.546 32.2179C316.076 30.937 313.896 30.9034 312.386 32.1384L300.893 41.542C299.484 42.6952 297.473 42.7508 296.002 41.6773L282.578 31.8814C281.07 30.7808 279.001 30.87 277.593 32.0962L266.973 41.3458C265.535 42.5983 263.413 42.6614 261.903 41.4966L249.518 31.9423C248.044 30.8052 245.98 30.8353 244.54 32.0149L233.051 41.4251C231.578 42.632 229.458 42.6325 227.984 41.4265L216.46 31.9984C215.028 30.8265 212.979 30.7902 211.506 31.9105L198.707 41.6452C197.268 42.7396 195.273 42.7328 193.842 41.6285L181.322 31.9704C179.832 30.8205 177.741 30.8657 176.301 32.079L165.306 41.3458C163.826 42.5929 161.666 42.6019 160.176 41.3673L147.859 31.1615C146.353 29.9141 144.167 29.9377 142.689 31.2173L131.222 41.1439C129.674 42.4833 127.366 42.4388 125.871 41.0407L115.649 31.4778C114.146 30.0719 111.821 30.0357 110.276 31.3942L99.1814 41.1436C97.6538 42.4861 95.3619 42.4686 93.8549 41.1029L83.0687 31.3279C81.5946 29.9919 79.3626 29.9424 77.8306 31.2118L65.6167 41.3319C64.1077 42.5822 61.9152 42.5552 60.4375 41.2681L50.2846 32.4253C48.712 31.0556 46.351 31.124 44.8603 32.5823L34.283 42.9297C33.9093 43.2953 33.4072 43.5 32.8844 43.5Z"
          fill="url(#paint0_linear_109_25)"
        />
        <g filter="url(#filter1_f_109_25)">
          <path
            d="M49.9547 111.567C47.0113 109.201 48.6843 104.45 52.4608 104.45H450.254C454.161 104.45 455.75 109.475 452.554 111.722L439.08 121.193C434.028 124.744 428.004 126.65 421.829 126.65H79.2803C72.4441 126.65 65.8128 124.315 60.4847 120.032L49.9547 111.567Z"
            fill="url(#paint1_linear_109_25)"
          />
        </g>
        <path
          d="M30 100.75H474V91.95C474 88.6363 471.314 85.95 468 85.95H36C32.6863 85.95 30 88.6363 30 91.95V100.75Z"
          fill="url(#paint2_linear_109_25)"
        />
        <g filter="url(#filter2_f_109_25)">
          <path
            d="M37.4 737.15H466.6L435.604 696.856C431.818 691.934 425.961 689.05 419.752 689.05H84.248C78.0386 689.05 72.1814 691.934 68.3955 696.856L37.4 737.15Z"
            fill="url(#paint3_linear_109_25)"
          />
        </g>
      </g>
      <rect
        x="38"
        y="81.4997"
        width="428"
        height="4"
        rx="2"
        fill="url(#paint4_linear_109_25)"
      />
      <rect
        x="38"
        y="768.5"
        width="428"
        height="4"
        rx="2"
        fill="url(#paint5_linear_109_25)"
      />
      <rect
        x="38"
        y="70.4997"
        width="428"
        height="4"
        rx="2"
        fill="url(#paint6_linear_109_25)"
      />
      <rect
        x="38"
        y="757.5"
        width="428"
        height="4"
        rx="2"
        fill="url(#paint7_linear_109_25)"
      />
      <rect
        x="38"
        y="59.4997"
        width="428"
        height="4"
        rx="2"
        fill="url(#paint8_linear_109_25)"
      />
      <rect
        x="38"
        y="746.5"
        width="428"
        height="4"
        rx="2"
        fill="url(#paint9_linear_109_25)"
      />
      <defs>
        <filter
          id="filter0_d_109_25"
          x="0"
          y="0.153535"
          width="504"
          height="841.346"
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
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_109_25"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_109_25"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_f_109_25"
          x="47.4528"
          y="103.45"
          width="407.809"
          height="24.2"
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
            stdDeviation="0.5"
            result="effect1_foregroundBlur_109_25"
          />
        </filter>
        <filter
          id="filter2_f_109_25"
          x="35.4"
          y="687.05"
          width="433.2"
          height="52.1"
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
            stdDeviation="1"
            result="effect1_foregroundBlur_109_25"
          />
        </filter>
        <linearGradient
          id="paint0_linear_109_25"
          x1="474"
          y1="416.175"
          x2="30"
          y2="416.175"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color[0]} />
          <stop offset="0.634615" stopColor={color[1]} />
          <stop offset="1" stopColor={color[2]} />
        </linearGradient>
        <linearGradient
          id="paint1_linear_109_25"
          x1="252"
          y1="104.45"
          x2="252"
          y2="126.65"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_109_25"
          x1="252"
          y1="100.75"
          x2="252"
          y2="85.95"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_109_25"
          x1="252"
          y1="737.15"
          x2="252"
          y2="689.05"
          gradientUnits="userSpaceOnUse"
        >
          <stop />
          <stop offset="1" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient
          id="paint4_linear_109_25"
          x1="252"
          y1="81.4997"
          x2="252"
          y2="85.4997"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2E3335" />
          <stop offset="0.5" stopColor="#495A64" />
          <stop offset="1" />
        </linearGradient>
        <linearGradient
          id="paint5_linear_109_25"
          x1="252"
          y1="768.5"
          x2="252"
          y2="772.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2E3335" />
          <stop offset="0.5" stopColor="#495A64" />
          <stop offset="1" />
        </linearGradient>
        <linearGradient
          id="paint6_linear_109_25"
          x1="252"
          y1="70.4997"
          x2="252"
          y2="74.4997"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2E3335" />
          <stop offset="0.5" stopColor="#495A64" />
          <stop offset="1" />
        </linearGradient>
        <linearGradient
          id="paint7_linear_109_25"
          x1="252"
          y1="757.5"
          x2="252"
          y2="761.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2E3335" />
          <stop offset="0.5" stopColor="#495A64" />
          <stop offset="1" />
        </linearGradient>
        <linearGradient
          id="paint8_linear_109_25"
          x1="252"
          y1="59.4997"
          x2="252"
          y2="63.4997"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2E3335" />
          <stop offset="0.5" stopColor="#495A64" />
          <stop offset="1" />
        </linearGradient>
        <linearGradient
          id="paint9_linear_109_25"
          x1="252"
          y1="746.5"
          x2="252"
          y2="750.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2E3335" />
          <stop offset="0.5" stopColor="#495A64" />
          <stop offset="1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const COLOR: Record<number, string[]> = {
  0: ["#1E2326", "#353F44", "#121A1E"],
  1: ["#351E04", "#F6CB61", "#473606"],
  2: ["#1E2326", "#A63335", "#121A1E"],
  3: ["#1E2326", "#503D7B", "#121A1E"]
};
