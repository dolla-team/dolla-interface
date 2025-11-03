import clsx from "clsx";
import Particles from "@/components/animations/Particles";

export default function ProgressBar({
  progress,
  spilled,
  spilledPercent,
  status
}: {
  progress: number;
  spilled: number;
  spilledPercent: number;
  status: string;
}) {
  return (
    <div
      className={clsx(
        "relative flex items-center w-[220px]",
        Number(status) !== 1 && "grayscale"
      )}
    >
      <div
        className={clsx(
          "h-[10px] w-[110px] rounded-[30px] bg-[#0000001A] p-[2px]"
        )}
      >
        <div
          className={clsx(
            "rounded-[10px] h-[6px] relative",
            "bg-[linear-gradient(to_right,#FFE9B2_0%,#FFC42F_47.6%,#F88E51_100%)]"
          )}
          style={{
            width: `${Math.min(progress, 100)}%`
          }}
        >
          {progress > 0 && spilled <= 0 && Number(status) === 1 && (
            <Particles />
          )}
        </div>
      </div>
      {spilled > 0 && (
        <>
          <div
            style={{ width: Math.min(spilledPercent!, 100) * 1.1 + "px" }}
            className="absolute top-[2px] left-[110px] z-[3] h-[6px] rounded-[10px] bg-linear-to-r from-[#C637FF] to-[#FFADCF]"
          >
            {Number(status) === 1 && <Particles />}
          </div>
        </>
      )}
    </div>
  );
}
