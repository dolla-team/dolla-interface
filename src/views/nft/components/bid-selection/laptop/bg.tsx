export default function Bg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="200"
      viewBox="0 0 1512 200"
      fill="none"
      preserveAspectRatio="none"
      className={className}
    >
      <g filter="url(#filter0_d_2963_6305)">
        <path
          d="M0 83.1464C0 83.1464 364.5 31 756 31C1147.5 31 1512 83.1464 1512 83.1464V280H0V83.1464Z"
          fill="url(#paint0_radial_2963_6305)"
        />
        <path
          d="M756 30.5C951.77 30.5 1140.79 43.5377 1280.86 56.5752C1350.89 63.094 1408.7 69.6128 1448.99 74.502C1469.14 76.9465 1484.91 78.9841 1495.64 80.4102C1501.01 81.1232 1505.11 81.6834 1507.88 82.0654C1509.26 82.2564 1510.31 82.4032 1511.01 82.502C1511.36 82.5513 1511.63 82.5882 1511.8 82.6133C1511.89 82.6258 1511.96 82.6353 1512 82.6416C1512.03 82.6447 1512.04 82.6478 1512.05 82.6494C1512.06 82.6502 1512.06 82.65 1512.07 82.6504C1512.07 82.6508 1512.07 82.6515 1512 83.1465L1512.07 82.6514L1512.5 82.7129V280.5H-0.5V82.7129L-0.0712891 82.6514L0 83.1465C-0.0708104 82.6515 -0.0692211 82.6508 -0.0664062 82.6504C-0.0636167 82.65 -0.0591447 82.6502 -0.0537109 82.6494C-0.0425597 82.6478 -0.025973 82.6447 -0.00390625 82.6416C0.0405071 82.6353 0.106966 82.6258 0.195312 82.6133C0.372201 82.5882 0.637274 82.5513 0.988281 82.502C1.69029 82.4032 2.73824 82.2564 4.12109 82.0654C6.88717 81.6834 10.995 81.1232 16.3613 80.4102C27.0945 78.9841 42.8636 76.9465 63.0098 74.502C103.303 69.6128 161.105 63.094 231.142 56.5752C371.213 43.5377 560.23 30.5 756 30.5Z"
          stroke="url(#paint1_linear_2963_6305)"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_2963_6305"
          x="-31"
          y="0"
          width="1574"
          height="311"
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
            result="effect1_dropShadow_2963_6305"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2963_6305"
            result="shape"
          />
        </filter>
        <radialGradient
          id="paint0_radial_2963_6305"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(756 31) rotate(90) scale(151.103 1477.83)"
        >
          <stop stopColor="#292040" />
          <stop offset="1" stopColor="#0A070B" />
        </radialGradient>
        <linearGradient
          id="paint1_linear_2963_6305"
          x1="756"
          y1="31"
          x2="756"
          y2="86.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#5A5076" />
          <stop offset="1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
