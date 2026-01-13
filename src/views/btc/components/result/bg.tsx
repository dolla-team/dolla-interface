import clsx from "clsx";
import { motion } from "framer-motion";
import { addThousandSeparator } from "@/utils/format/number";

export default function ResultBg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="778"
      height="778"
      viewBox="0 0 778 778"
      fill="none"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <g opacity="0.2" filter="url(#filter0_f_6243_20250)">
        <path
          d="M388.998 388.97L494.657 33.6924L560.093 60.165L388.999 388.978L389.003 388.988L624.964 103.119L674.876 153.031L389.004 388.99L389.006 388.997H389.008L717.849 217.945L744.312 283.385L389.022 388.996L758 353.705V424.293L389.012 388.999L389.008 389L389.017 389.007L744.305 494.67L717.833 560.105L389.028 389.017L674.881 624.964L624.969 674.876L389.013 389.009L389.011 389.008L560.067 717.857L494.628 744.32L389.008 389.007L389.001 389.003L389.008 389.005V389.004L389.006 389.001L388.997 389.003L424.291 758H353.703L388.996 389.004L388.994 389.005L388.998 389.002L388.993 389L388.988 389.006L388.994 389.005L388.986 389.008L283.322 744.301L217.887 717.829L388.981 389.015L153.031 674.876L103.119 624.964L388.975 389.015L60.1387 560.063L33.6758 494.624L388.982 389.008L388.985 389.005L388.988 388.999L20 424.293V353.705L388.977 388.995L33.6973 283.335L60.1689 217.899L388.989 388.997L388.996 388.998L388.995 388.99L388.994 388.989L388.99 388.997L388.992 388.988L103.124 153.031L153.036 103.119L388.993 388.986V388.984L388.992 388.973L217.949 60.1475L283.389 33.6836L388.989 388.94L353.703 20H424.291L388.998 388.97ZM388.988 389.003L388.992 389L388.988 388.999V389.003ZM389.002 388.991L388.997 388.997L388.999 388.994L388.997 388.992V388.998L389 388.999H388.997V389L388.996 388.999H388.994L388.999 389.001L389.005 388.999H389L389.005 388.997L389.002 388.991ZM388.997 388.99L389 388.993L389.002 388.99L388.997 388.982V388.99Z"
          fill="url(#paint0_radial_6243_20250)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_6243_20250"
          x="0"
          y="0"
          width="778"
          height="778"
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
            stdDeviation="10"
            result="effect1_foregroundBlur_6243_20250"
          />
        </filter>
        <radialGradient
          id="paint0_radial_6243_20250"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(389 389) rotate(90) scale(369)"
        >
          <stop stopColor="#FFCE52" />
          <stop offset="1" stopColor="#FFCE52" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export const PointsCardBg = ({
  className,
  points
}: {
  className: string;
  points: number;
}) => {
  return (
    <motion.div
      className={clsx(
        "absolute bg-[url('/btc/points-card.png')] bg-cover bg-center bg-no-repeat w-[431px] h-[495px]",
        className
      )}
      animate={{
        y: [0, -15, 0]
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div
        className="text-[42px] font-[700] w-full text-center rotate-[9deg] absolute top-[102px] left-[24px] bg-[linear-gradient(115deg,#FFE9B2_42.41%,#BC9B48_94.73%)] bg-clip-text text-transparent"
        style={{
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        {points > 9999 ? "9,999+" : addThousandSeparator(points.toString())}
      </div>
    </motion.div>
  );
};

export const TicketsCardBg = ({
  className,
  tickets
}: {
  className: string;
  tickets: number;
}) => {
  return (
    <motion.div
      className={clsx(
        "absolute bg-[url('/btc/tickets-card.png')] bg-cover bg-center bg-no-repeat w-[431px] h-[495px]",
        className
      )}
      animate={{
        y: [0, -15, 0]
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.3
      }}
    >
      <div className="text-[36px] font-[700] w-full text-center rotate-[-9deg] absolute top-[124px] left-[-18px]">
        <span
          className="bg-[linear-gradient(270deg,_#000_8%,_#80F_79.15%)] bg-clip-text text-transparent"
          style={{
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          x{tickets > 100 ? "99+" : tickets}
        </span>
      </div>
    </motion.div>
  );
};
