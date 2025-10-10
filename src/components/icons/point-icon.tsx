export default function PointIcon({
  className,
  size = 26
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      className={className}
    >
      <circle cx="30" cy="30" r="30" fill="#FDC93A" />
      <circle cx="30" cy="30.0001" r="26" fill="#6D5000" />
      <ellipse
        cx="29.999"
        cy="30"
        rx="12"
        ry="12"
        stroke="#FFC42F"
        stroke-width="2"
      />
    </svg>
  );
}
