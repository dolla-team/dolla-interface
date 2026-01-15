import { useNavigate } from "@/libs/router";

export default function BackButton({ onClick }: { onClick?: () => void }) {
  const navigate = useNavigate();
  return (
    <button
      className="button w-[88px] h-[34px] rounded-[20px] border border-[#E4E4E4] bg-[#FFFFFF80] flex items-center justify-center gap-[8px]"
      onClick={() => {
        if (onClick) {
          onClick();
          return;
        }
        navigate(-1 as any);
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
          stroke="#8A87AA"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[#8A87AA] text-[12px]">Back</span>
    </button>
  );
}
