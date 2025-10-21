import clsx from "clsx";
import { motion } from "framer-motion";

export default function Round({ status }: any) {
  return (
    <div
      className={clsx(
        "absolute bottom-[-250px] left-[30%]",
        status === 0 && "opacity-30"
      )}
    >
      <motion.div
        className="w-[342px] h-[342px] bg-[url('/lucky-draw/lucky-draw-round.png')] bg-no-repeat bg-center bg-contain"
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
        width="77"
        height="90"
        viewBox="0 0 77 90"
        fill="none"
        className="absolute top-[-10px] left-[50%] translate-x-[-50%]"
      >
        <g filter="url(#filter0_d_5136_10585)">
          <path
            d="M36.5721 62.025C37.1935 63.8188 39.7303 63.8188 40.3517 62.025L53.014 25.4722C53.3999 24.3583 52.7405 23.167 51.5804 22.9575C48.9648 22.4852 44.1846 21.8001 38.4621 21.8001C32.7394 21.8001 27.9591 22.4852 25.3434 22.9575C24.1833 23.167 23.5239 24.3583 23.9098 25.4722L36.5721 62.025Z"
            fill="#10FFBF"
          />
          <path
            d="M36.0996 62.1885C36.8763 64.4307 40.0475 64.4307 40.8242 62.1885L53.4863 25.6357C53.9674 24.2468 53.1463 22.7326 51.6689 22.4658C49.0333 21.9899 44.2223 21.2998 38.4619 21.2998C32.7015 21.2998 27.8906 21.9899 25.2549 22.4658C23.7775 22.7326 22.9564 24.2468 23.4375 25.6357L36.0996 62.1885Z"
            stroke="black"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_5136_10585"
            x="-7.24792e-05"
            y="4.95911e-05"
            width="76.9239"
            height="89.1703"
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
              result="effect1_dropShadow_5136_10585"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_5136_10585"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
