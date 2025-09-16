import clsx from "clsx";

export default function SortIcon({
  active,
  expanded,
  onClick
}: {
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="11"
      viewBox="0 0 13 11"
      fill="none"
      className={clsx("duration-300 button", expanded ? "rotate-180" : "")}
      onClick={onClick}
    >
      <path
        opacity={active ? 1 : 0.3}
        d="M5.68118 9.83204C6.07934 10.4 6.92066 10.4 7.31882 9.83204L12.7577 2.07405C13.2223 1.41134 12.7482 0.5 11.9389 0.5H1.06112C0.251769 0.5 -0.222307 1.41134 0.2423 2.07405L5.68118 9.83204Z"
        fill="#8A87AA"
      />
    </svg>
  );
}
