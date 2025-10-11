export default function ExchangeIcon({ onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="h-[8px] flex justify-center items-center duration-500 relative button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 41 41"
        fill="none"
      >
        <rect
          x="0.5"
          y="0.5"
          width="40"
          height="40"
          rx="8.5"
          fill="#141519"
          stroke="#373737"
        />
        <path
          d="M26 17L20 23L14 17"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
