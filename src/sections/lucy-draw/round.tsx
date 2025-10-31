import clsx from "clsx";
import { motion } from "framer-motion";

export default function Round({ status, size, className }: any) {
  return (
    <div className={clsx("absolute left-0 top-0", className)}>
      <motion.div
        className="bg-[url('/lucky-draw/lucky-draw-round.png')] bg-no-repeat bg-center bg-contain"
        style={{
          width: size,
          height: size
        }}
        animate={
          status === 1
            ? {
                rotate: 360
              }
            : {}
        }
        transition={
          status === 1
            ? {
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }
            : {}
        }
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size * 0.5}
        height={size * 0.5}
        viewBox="0 0 65 67"
        fill="none"
        className="absolute top-[-20%] left-[50%] translate-x-[-50%]"
      >
        <g filter="url(#filter0_d_5387_51474)">
          <path
            d="M30.4774 39.4039C31.1833 40.9814 33.4227 40.9814 34.1286 39.4039L40.6321 24.8692C41.1598 23.6897 40.4452 22.3473 39.1617 22.198C37.4808 22.0024 35.0718 21.7999 32.3031 21.7999C29.5343 21.7999 27.1253 22.0024 25.4443 22.198C24.1608 22.3473 23.4462 23.6898 23.9739 24.8692L30.4774 39.4039Z"
            fill="#FFC42F"
          />
          <path
            d="M30.0215 39.6079C30.9038 41.5798 33.7026 41.5798 34.585 39.6079L41.0889 25.0737C41.7459 23.6054 40.8592 21.8926 39.2197 21.7017C37.5244 21.5044 35.0951 21.3003 32.3027 21.3003C29.5106 21.3003 27.082 21.5044 25.3867 21.7017C23.7471 21.8924 22.8605 23.6053 23.5176 25.0737L30.0215 39.6079Z"
            stroke="url(#paint0_linear_5387_51474)"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_5387_51474"
            x="-0.00019455"
            y="-0.00019455"
            width="64.6059"
            height="66.3871"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="11.4" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_5387_51474"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5387_51474"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_5387_51474"
            x1="32.303"
            y1="21.7999"
            x2="32.303"
            y2="43.4839"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="#999999" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
