import clsx from "clsx";

export default function CloseIcon({
  onClick,
  className
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className={clsx("button", className)}
      onClick={onClick}
    >
      <foreignObject x="-10" y="-10" width="52" height="52">
        <div
          style={{
            backdropFilter: "blur(5px)",
            clipPath: "url(#bgblur_0_5387_58251_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <circle
        data-figma-bg-blur-radius="10"
        cx="16"
        cy="16"
        r="16"
        fill="white"
        fill-opacity="0.2"
      />
      <path
        d="M16 14.9814L19 11H21L17 16.3086L21 21.6172H19L16 17.6357L13 21.6172H11L15 16.3086L11 11H13L16 14.9814Z"
        fill="white"
      />
      <defs>
        <clipPath
          id="bgblur_0_5387_58251_clip_path"
          transform="translate(10 10)"
        >
          <circle cx="16" cy="16" r="16" />
        </clipPath>
      </defs>
    </svg>
  );
}
