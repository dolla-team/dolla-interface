import clsx from "clsx";

export default function ModalClose({
  onClose,
  className
}: {
  onClose: () => void;
  className?: string;
}) {
  return (
    <button
      className={clsx("button p-[2px] rounded", className)}
      onClick={onClose}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="11"
        viewBox="0 0 10 11"
        fill="none"
      >
        <path
          d="M5 3.98145L8 0H10L6 5.30859L10 10.6172H8L5 6.63574L2 10.6172H0L4 5.30859L0 0H2L5 3.98145Z"
          fill="#BBACA6"
        />
      </svg>
    </button>
  );
}
