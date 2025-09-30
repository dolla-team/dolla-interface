import clsx from "clsx";
import Skeleton from "@/components/skeleton";

export default function Market({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "w-[280px] h-[168px] cursor-pointer group shrink-0 rounded-[20px] border-[2px] border-transparent hover:border-[#99761D] hover:scale-[1.05] hover:shadow-[0px_0px_20px_0px_rgba(255,_239,_67,_0.60)] bg-[#222A35] transition-all duration-300 relative",
        className
      )}
    >
      <div className="relative z-[2]">
        <div className="flex items-center justify-between pt-[14px] px-[12px]">
          <div className="flex items-center gap-[6px]">
            <Skeleton className="w-[20px] h-[20px] rounded-[4px]" />
            <Skeleton className="w-[60px] h-[20px] rounded-[4px]" />
          </div>

          <Skeleton className="w-[60px] h-[20px] rounded-[4px]" />
        </div>
        <div className="mt-[16px] mx-[6px] h-[40px] rounded-[6px] flex flex-col items-center justify-center px-[6px]">
          <Skeleton className="w-[92px] h-[30px] rounded-[4px]" />
          <Skeleton className="w-[70px] h-[20px] rounded-[4px] mt-[8px]" />
        </div>
        <div className="px-[12px] mt-[16px] flex items-center justify-between text-[14px] text-white">
          <div className="flex items-center gap-[5px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="20"
              viewBox="0 0 17 20"
              fill="none"
            >
              <path
                d="M8.33598 0.00373027C10.7664 0.0628534 12.7038 0.80102 14.1475 2.21857C15.5911 3.6361 16.2852 5.4885 16.2295 7.77521C16.175 10.0142 15.3918 11.8066 13.8809 13.1522C13.2686 13.6975 12.5798 14.1247 11.8165 14.4393C13.7619 15.4125 14.5475 17.1286 14.6153 18.1453C14.5956 18.1578 12.3884 19.5555 8.28715 19.5555C4.18941 19.5554 2.20831 18.16 2.18754 18.1453C2.38412 17.1627 3.07711 15.527 4.83891 14.5399C3.79126 14.1698 2.87344 13.6132 2.08696 12.8651C0.643273 11.4475 -0.051528 9.61888 0.00297316 7.37971C0.0587088 5.09315 0.841831 3.27706 2.35258 1.93146C3.91112 0.586999 5.9057 -0.055334 8.33598 0.00373027Z"
                fill="white"
              />
              <path
                d="M5.18359 4.81055L5.18359 6.81268"
                stroke="black"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M11.924 5.20996L9.9895 5.72815"
                stroke="black"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M5.38489 9.81556C6.98704 10.8166 10.3916 10.6164 11.9938 8.41406"
                stroke="black"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <Skeleton className="w-[40px] h-[20px] rounded-[4px]" />
          </div>
          <div className="flex items-center gap-[5px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
            >
              <path
                d="M15.6611 14.6255C15.6687 15.3982 11.9942 16.9995 7.72656 16.9995C3.4594 16.9994 0.000447388 15.4539 0 14.6812L0.0078125 12.3628C0.879943 12.878 3.63805 13.9086 7.72656 13.9087C11.8153 13.9087 14.7889 13.1355 15.6611 12.3628V14.6255ZM15.6611 9.21631C15.6687 9.98904 11.9942 11.5903 7.72656 11.5903C3.45913 11.5902 0 10.0447 0 9.27197L0.0078125 6.95361C0.879832 7.46875 3.63789 8.49943 7.72656 8.49951C11.8155 8.49951 14.7891 7.72633 15.6611 6.95361V9.21631ZM7.73438 -0.000488281C12.002 -0.000488281 15.4619 1.38327 15.4619 3.09033C15.4617 4.79733 12.0019 6.18115 7.73438 6.18115C3.46703 6.18106 0.00799003 4.79727 0.0078125 3.09033C0.0078125 1.38333 3.46692 -0.000392673 7.73438 -0.000488281Z"
                fill="white"
              />
            </svg>
            <Skeleton className="w-[60px] h-[20px] rounded-[4px]" />
          </div>
        </div>
        <Skeleton className="mt-[15px] h-[3px] rounded-[6px] bg-[#191E27] relative mx-[11px]" />
      </div>
    </div>
  );
}
