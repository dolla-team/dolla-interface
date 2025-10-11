import { useNavigate } from "react-router-dom";
import clsx from "clsx";

export default function PageBack({ className }: { className?: string }) {
  const navigate = useNavigate();
  return (
    <button
      className={clsx(
        "absolute z-[10] top-[30px] left-[30px] text-[#FFFFFF] button flex justify-center items-center gap-[5px] h-[34px] w-[88px] rounded-[16px] border border-[#555555] bg-[#FFFFFF33]",
        className
      )}
      onClick={() => {
        navigate(-1);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="12"
        viewBox="0 0 8 12"
        fill="none"
      >
        <path
          d="M7 1L2 6L7 11"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[12px]">Back</span>
    </button>
  );
}
