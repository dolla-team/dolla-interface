export default function StarBg({
  className,
  size = 119
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * 0.8152515723270423}
      viewBox="0 0 119 97"
      fill="none"
      className={className}
    >
      <path
        opacity="0.3"
        d="M67.4062 65.4805L93.5732 4.97754L107.427 12.9756L68.1084 65.8896L121.025 26.5742L129.022 40.4268L68.5176 66.5918L134 59.002V74.998L68.5146 67.4053L129.022 93.5732L121.024 107.427L68.1113 68.1104L107.427 121.024L93.5732 129.022L67.4043 68.5107L74.998 134H59.002L66.5918 68.5195L40.4268 129.022L26.5732 121.024L65.8848 68.1143L12.9756 107.427L4.97754 93.5742L65.4775 67.4062L0 74.998V59.002L65.4795 66.5908L4.97754 40.4268L12.9756 26.5732L65.8896 65.8887L26.5732 12.9746L40.4268 4.97656L66.5889 65.4697L59.002 0H74.998L67.4062 65.4805Z"
        fill="url(#paint0_radial_1967_1953)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_1967_1953"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(67 67) rotate(90) scale(67)"
        >
          <stop stopColor="#FFC42F" />
          <stop offset="1" stopColor="#99761C" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
