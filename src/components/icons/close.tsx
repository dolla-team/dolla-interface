export default function CloseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
    >
      <circle cx="10" cy="10" r="10" fill="#434343" fillOpacity="0.8" />
      <path
        d="M14.3478 6.08691L6.08691 14.3478"
        stroke="#ABABAB"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6.08679 6.08691L14.3477 14.3478"
        stroke="#ABABAB"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
