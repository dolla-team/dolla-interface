import useCountdown, { getTimePeriods, toTwo } from "@/hooks/use-count-down";
import { useConfigStore } from "@/stores/use-config";
import { useEffect, useMemo } from "react";
import * as parser from "cron-parser";
import clsx from "clsx";

export default function Timer({
  onTimeUp,
  currentRound,
  className,
  size = 14
}: {
  onTimeUp: () => void;
  currentRound: number;
  className?: string;
  size?: number;
}) {
  const configStore = useConfigStore();

  const time = useMemo(() => {
    if (!configStore.config) return 0;
    const interval = parser?.default.parse(
      configStore.config?.ticket_job_time,
      {
        tz: "America/New_York"
      }
    );
    const next = interval.next().getTime();

    return next / 1000;
  }, [configStore.config, currentRound]);

  const { secondsRemaining } = useCountdown(time);
  const { hours, minutes, seconds } = getTimePeriods(secondsRemaining);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onTimeUp();
    }
  }, [secondsRemaining]);

  return (
    <div
      className={clsx(
        "w-[115px] h-[30px] text-center text-[14px] p-[6px] border border-[#6A5D3A] text-white flex items-center justify-between rounded-[16px] border border-[#FFE9B2] bg-[#00000033] font-semibold",
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size * 1.1428571428571428}
        viewBox="0 0 14 16"
        fill="none"
      >
        <path
          d="M7 2.18182C8.55621 2.18182 9.99084 2.69164 11.1543 3.54255L12.1608 2.54909C12.2293 2.48157 12.3105 2.42801 12.3999 2.39146C12.4892 2.35492 12.585 2.33611 12.6818 2.33611C12.7785 2.33611 12.8743 2.35492 12.9637 2.39146C13.0531 2.42801 13.1343 2.48157 13.2027 2.54909C13.2711 2.61661 13.3254 2.69678 13.3624 2.785C13.3995 2.87322 13.4185 2.96778 13.4185 3.06327C13.4185 3.15877 13.3995 3.25332 13.3624 3.34155C13.3254 3.42977 13.2711 3.50993 13.2027 3.57745L12.2412 4.52727C13.3737 5.78469 13.9995 7.40848 14 9.09091C14 12.9004 10.8596 16 7 16C3.14042 16 0 12.9004 0 9.09091C0 5.28145 3.14042 2.18182 7 2.18182ZM7 3.63636C3.95242 3.63636 1.47368 6.08291 1.47368 9.09091C1.47368 12.0989 3.95242 14.5455 7 14.5455C10.0476 14.5455 12.5263 12.0989 12.5263 9.09091C12.5263 6.08291 10.0476 3.63636 7 3.63636ZM6.63158 5.81818C6.72834 5.81818 6.82416 5.83699 6.91356 5.87354C7.00295 5.91009 7.08418 5.96366 7.1526 6.0312C7.22103 6.09873 7.2753 6.1789 7.31233 6.26714C7.34936 6.35538 7.36842 6.44995 7.36842 6.54545V9.06545L9.25105 10.304C9.40479 10.4147 9.50925 10.5797 9.54261 10.7646C9.57596 10.9495 9.53563 11.14 9.43004 11.2962C9.32445 11.4524 9.16177 11.5623 8.97599 11.603C8.79022 11.6436 8.59573 11.6118 8.43316 11.5142L6.22263 10.0596C6.12175 9.9932 6.03903 9.90321 5.98183 9.79766C5.92464 9.69211 5.89472 9.57425 5.89474 9.45455V6.54545C5.89474 6.35257 5.97237 6.16759 6.11055 6.0312C6.24874 5.8948 6.43616 5.81818 6.63158 5.81818ZM9.57895 8.52353e-09C9.67572 -1.46143e-05 9.77155 0.018786 9.86096 0.0553284C9.95037 0.0918707 10.0316 0.145439 10.1 0.212974C10.1685 0.280509 10.2228 0.360688 10.2598 0.448932C10.2968 0.537176 10.3159 0.631757 10.3159 0.727273C10.3159 0.822789 10.2968 0.91737 10.2598 1.00561C10.2228 1.09386 10.1685 1.17404 10.1 1.24157C10.0316 1.30911 9.95037 1.36267 9.86096 1.39922C9.77155 1.43576 9.67572 1.45456 9.57895 1.45455H4.42105C4.32428 1.45456 4.22845 1.43576 4.13904 1.39922C4.04963 1.36267 3.96839 1.30911 3.89995 1.24157C3.83152 1.17404 3.77723 1.09386 3.7402 1.00561C3.70316 0.91737 3.6841 0.822789 3.6841 0.727273C3.6841 0.631757 3.70316 0.537176 3.7402 0.448932C3.77723 0.360688 3.83152 0.280509 3.89995 0.212974C3.96839 0.145439 4.04963 0.0918707 4.13904 0.0553284C4.22845 0.018786 4.32428 -1.46143e-05 4.42105 8.52353e-09H9.57895Z"
          fill="white"
        />
      </svg>

      <span className="pr-[4px]">
        {secondsRemaining <= 0
          ? "Times Up!"
          : `${toTwo(hours)} : ${toTwo(minutes)} : ${toTwo(seconds)}`}
      </span>
    </div>
  );
}
