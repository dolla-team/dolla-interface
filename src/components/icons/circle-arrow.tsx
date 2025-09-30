export default function CircleArrow({
  className,
  size = 22,
  onClick
}: {
  className?: string;
  size?: number;
  onClick?: () => void;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 22 22"
      fill="none"
      className={className}
      onClick={onClick}
    >
      <path
        d="M11 0.5C16.799 0.5 21.5 5.20101 21.5 11C21.5 16.799 16.799 21.5 11 21.5C5.20101 21.5 0.5 16.799 0.5 11C0.5 5.20101 5.20101 0.5 11 0.5Z"
        fill="black"
        fillOpacity="0.2"
        stroke="#6A5D3A"
      />
      <path d="M10 7L13 11L10 15" stroke="white" strokeWidth="1.5" />
    </svg>
  );
}
