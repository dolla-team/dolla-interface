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
      <div className={clsx("h-[10px] w-[110px] rounded-[30px] bg-[#00000033]")}>
        <div
          className={clsx(
            "rounded-[10px] h-full relative",
            progress > 80 ? "bg-[#FFB700]" : "bg-[#22D25D]"
          )}
          style={{
            width: `${Math.min(progress, 100)}%`
          }}
        >
          {progress > 80 && spilled <= 0 && Number(status) === 1 && (
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
