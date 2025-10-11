import clsx from "clsx";

export default function MArrowBtn({ expand, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-[30px] h-[30px] rounded-[8px] border border-[#3B3951] bg-[#FFFFFF1A] flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="17"
        height="11"
        viewBox="0 0 17 11"
        fill="none"
        className={clsx("duration-300", !expand ? "rotate-180" : "rotate-0")}
      >
        <path
          d="M7.0025 10.3084C7.79842 11.2075 9.20159 11.2075 9.99751 10.3084L15.5152 4.0757C16.6578 2.78501 15.7414 0.75 14.0176 0.75H2.98236C1.25857 0.75 0.342242 2.78501 1.48485 4.0757L7.0025 10.3084Z"
          fill="#FFE9B2"
        />
      </svg>
    </button>
  );
}
