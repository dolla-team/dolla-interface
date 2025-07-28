export default function PointIcon({
  className,
  size = 26
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 26 26"
      fill="none"
      className={className}
    >
      <g filter="url(#filter0_i_2259_2666)">
        <circle cx="13" cy="13" r="13" fill="url(#paint0_linear_2259_2666)" />
      </g>
      <circle cx="13" cy="13" r="12.5" stroke="#DD9000" />
      <path
        d="M13 6C16.866 6 20 9.13401 20 13C20 16.866 16.866 20 13 20C9.13401 20 6 16.866 6 13C6 9.13401 9.13401 6 13 6ZM13 8.58691C10.5627 8.58691 8.58691 10.5627 8.58691 13C8.58691 15.4373 10.5627 17.4131 13 17.4131C15.4373 17.4131 17.4131 15.4373 17.4131 13C17.4131 10.5627 15.4373 8.58691 13 8.58691Z"
        fill="url(#paint1_linear_2259_2666)"
      />
      <path
        d="M13 6V6.2C16.7555 6.2 19.8 9.24446 19.8 13H20H20.2C20.2 9.02355 16.9764 5.8 13 5.8V6ZM20 13H19.8C19.8 16.7555 16.7555 19.8 13 19.8V20V20.2C16.9764 20.2 20.2 16.9764 20.2 13H20ZM13 20V19.8C9.24446 19.8 6.2 16.7555 6.2 13H6H5.8C5.8 16.9764 9.02355 20.2 13 20.2V20ZM6 13H6.2C6.2 9.24446 9.24446 6.2 13 6.2V6V5.8C9.02355 5.8 5.8 9.02355 5.8 13H6ZM13 8.58691V8.38691C10.4523 8.38691 8.38691 10.4523 8.38691 13H8.58691H8.78691C8.78691 10.6732 10.6732 8.78691 13 8.78691V8.58691ZM8.58691 13H8.38691C8.38691 15.5477 10.4523 17.6131 13 17.6131V17.4131V17.2131C10.6732 17.2131 8.78691 15.3268 8.78691 13H8.58691ZM13 17.4131V17.6131C15.5477 17.6131 17.6131 15.5477 17.6131 13H17.4131H17.2131C17.2131 15.3268 15.3268 17.2131 13 17.2131V17.4131ZM17.4131 13H17.6131C17.6131 10.4523 15.5477 8.38691 13 8.38691V8.58691V8.78691C15.3268 8.78691 17.2131 10.6732 17.2131 13H17.4131Z"
        fill="#CE952B"
      />
      <defs>
        <filter
          id="filter0_i_2259_2666"
          x="0"
          y="0"
          width="26"
          height="26"
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
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="1" dy="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result="effect1_innerShadow_2259_2666"
          />
        </filter>
        <linearGradient
          id="paint0_linear_2259_2666"
          x1="0"
          y1="13"
          x2="26"
          y2="13"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFCE52" />
          <stop offset="1" stopColor="#FFE9B2" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2259_2666"
          x1="13"
          y1="6"
          x2="13"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C18B00" />
          <stop offset="1" stopColor="#E7B22A" />
        </linearGradient>
      </defs>
    </svg>
  );
}
