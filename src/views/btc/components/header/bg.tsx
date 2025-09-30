export default function HeaderBg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="198"
      viewBox="0 0 1512 198"
      fill="none"
      preserveAspectRatio="none"
      className={className}
    >
      <foreignObject x="-51" y="-359" width="1615" height="606.452">
        <div
          style={{
            backdropFilter: "blur(25px)",
            clipPath: "url(#bgblur_0_4184_1179_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <g data-figma-bg-blur-radius="50">
        <path
          d="M534.054 130.877L0 91.5V-308H1513V91.5L976.949 130.879C971.664 131.268 966.914 134.247 964.264 138.836L935.619 188.452C932.761 193.402 927.479 196.452 921.762 196.452H589.238C583.521 196.452 578.239 193.402 575.381 188.452L546.734 138.834C544.086 134.246 539.338 131.267 534.054 130.877Z"
          fill="black"
        />
        <path
          d="M534.054 130.877L0 91.5V-308H1513V91.5L976.949 130.879C971.664 131.268 966.914 134.247 964.264 138.836L935.619 188.452C932.761 193.402 927.479 196.452 921.762 196.452H589.238C583.521 196.452 578.239 193.402 575.381 188.452L546.734 138.834C544.086 134.246 539.338 131.267 534.054 130.877Z"
          fill="url(#paint0_radial_4184_1179)"
          fillOpacity="0.6"
        />
        <path
          d="M1513.5 -308.5V91.9648L1513.04 91.999L976.985 131.378C971.866 131.754 967.264 134.64 964.697 139.086L936.052 188.702C933.104 193.807 927.657 196.952 921.763 196.952H589.237C583.343 196.952 577.896 193.807 574.948 188.702L546.301 139.084C543.735 134.64 539.136 131.753 534.018 131.376L-0.0371094 91.999L-0.5 91.9648V-308.5H1513.5Z"
          stroke="url(#paint1_linear_4184_1179)"
          strokeOpacity="0.2"
        />
      </g>
      <defs>
        <clipPath
          id="bgblur_0_4184_1179_clip_path"
          transform="translate(51 359)"
        >
          <path d="M534.054 130.877L0 91.5V-308H1513V91.5L976.949 130.879C971.664 131.268 966.914 134.247 964.264 138.836L935.619 188.452C932.761 193.402 927.479 196.452 921.762 196.452H589.238C583.521 196.452 578.239 193.402 575.381 188.452L546.734 138.834C544.086 134.246 539.338 131.267 534.054 130.877Z" />
        </clipPath>
        <radialGradient
          id="paint0_radial_4184_1179"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(756.5 196.452) rotate(-90) scale(269.452 671.984)"
        >
          <stop stopColor="#FFC42F" />
          <stop offset="1" stopOpacity="0" />
        </radialGradient>
        <linearGradient
          id="paint1_linear_4184_1179"
          x1="756.5"
          y1="17"
          x2="756.5"
          y2="196.452"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#614D2D" stopOpacity="0" />
          <stop offset="1" stopColor="#C79E5C" />
        </linearGradient>
      </defs>
    </svg>
  );
}
