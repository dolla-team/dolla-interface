export default function ShareButton() {
  return (
    <button
      className="button w-[104px] h-[34px] rounded-[20px] border border-[#E4E4E4] bg-[#FFFFFF80] flex items-center justify-center gap-[8px]"
      onClick={() => {}}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M1 8.23333V13H13V8.23333M6.80645 9.1V2M6.80645 2L3.32258 5.03333M6.80645 2L10.2903 5.03333"
          stroke="#8A87AA"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-[#8A87AA] text-[12px]">Share</span>
    </button>
  );
}
