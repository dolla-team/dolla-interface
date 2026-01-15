import clsx from "clsx";
import { motion } from "framer-motion";

export default function MultipleTag({
  multipler,
  size,
  className,
  textClassName,
  extraContent
}: {
  multipler: number;
  size: number;
  className?: string;
  textClassName?: string;
  extraContent?: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        "absolute flex items-center justify-center font-bold text-black",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Bg size={size} />
      {Number(multipler) > 99 && !extraContent ? (
        <motion.div
          animate={{
            rotate: [0, -5, 5, -3, 3, -1, 1, 0],
            backgroundColor: [
              "#F264FF",
              "#366ac5",
              "#993ad8",
              "#f08227",
              "#993ad8",
              "#366ac5",
              "#F264FF"
            ]
          }}
          transition={{
            duration: 0.8,
            ease: "easeInOut",
            rotate: {
              duration: 0.8,
              times: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 1],
              repeat: Infinity
            },
            backgroundColor: {
              duration: 0.8,
              times: [0, 0.14, 0.28, 0.42, 0.56, 0.7, 1],
              repeat: Infinity
            }
          }}
          className={clsx(
            "border border-black rounded-[6px] px-[10px] relative z-[1] rotate-[15deg] bg-[#F264FF]",
            textClassName
          )}
        >
          {multipler}x
        </motion.div>
      ) : (
        <div className="relative z-[1] rotate-[15deg]">
          <div className={clsx(textClassName)}>{multipler}x</div>
          {extraContent}
        </div>
      )}
    </div>
  );
}

const Bg = ({ size }: { size: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className="absolute top-0 left-0"
    >
      <path
        d="M22.6652 1.02344C23.2638 0.32545 24.3439 0.325453 24.9425 1.02344L28.2179 4.84277C28.357 5.00467 28.584 5.06035 28.7823 4.98145L33.4562 3.12207C34.3106 2.78219 35.2671 3.2844 35.4728 4.18066L36.5978 9.08398C36.6456 9.29218 36.8209 9.44739 37.0333 9.46973L42.0363 9.99512C42.9507 10.0912 43.5645 10.98 43.3302 11.8691L42.048 16.7344C41.9936 16.9409 42.0763 17.1589 42.254 17.2773L46.4396 20.0684C47.2047 20.5785 47.3348 21.6507 46.714 22.3291L43.3175 26.041C43.1736 26.1986 43.146 26.4298 43.2482 26.6172L45.6573 31.0342C46.0975 31.8414 45.7145 32.8509 44.8497 33.1631L40.1173 34.8711C39.9164 34.9437 39.7838 35.1361 39.7872 35.3496L39.8683 40.3799C39.8831 41.2992 39.075 42.015 38.1642 41.8896L33.1798 41.2031C32.9682 41.1741 32.7614 41.2829 32.6652 41.4736L30.3995 45.9648C29.9854 46.7858 28.9369 47.0442 28.1886 46.5098L24.0948 43.5859C23.921 43.4618 23.6867 43.4618 23.5128 43.5859L19.4191 46.5098C18.6708 47.0442 17.6223 46.7858 17.2081 45.9648L14.9425 41.4736C14.8463 41.2829 14.6394 41.1741 14.4279 41.2031L9.44348 41.8896C8.53266 42.015 7.72458 41.2992 7.73938 40.3799L7.82043 35.3496C7.82386 35.1361 7.69122 34.9437 7.49036 34.8711L2.75793 33.1631C1.89316 32.8509 1.51013 31.8413 1.95032 31.0342L4.3595 26.6172C4.46165 26.4298 4.43402 26.1986 4.29016 26.041L0.893677 22.3291C0.27289 21.6507 0.402993 20.5785 1.16809 20.0684L5.35364 17.2773C5.53133 17.1589 5.61403 16.9409 5.55969 16.7344L4.27747 11.8691C4.0432 10.98 4.65696 10.0912 5.57141 9.99512L10.5743 9.46973C10.7868 9.4474 10.9621 9.29219 11.0099 9.08398L12.1349 4.18066C12.3405 3.2844 13.297 2.78219 14.1515 3.12207L18.8253 4.98145C19.0237 5.06035 19.2507 5.00467 19.3898 4.84277L22.6652 1.02344Z"
        fill="#EBFF57"
        stroke="black"
      />
    </svg>
  );
};
