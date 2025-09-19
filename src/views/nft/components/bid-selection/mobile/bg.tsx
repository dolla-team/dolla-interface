export default function Bg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="242"
      viewBox="0 0 390 242"
      fill="none"
      preserveAspectRatio="none"
      className={className}
    >
      <foreignObject x="-51" y="-50" width="492" height="343">
        <div
          style={{
            backdropFilter: "blur(25px)",
            clipPath: "url(#bgblur_0_2370_997_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <path
        data-figma-bg-blur-radius="50"
        d="M336.872 0.5C341.721 0.500012 346.132 3.30401 348.19 7.69434L360.465 33.8809C362.358 37.92 366.417 40.5 370.878 40.5H390.5V242.5H-0.5V40.5H18.8291C23.3112 40.4998 27.3851 37.8952 29.2666 33.8271L41.3262 7.75293C43.3713 3.33105 47.799 0.500142 52.6709 0.5H336.872Z"
        fill="white"
        fillOpacity="0.1"
        stroke="#3B3951"
      />
      <defs>
        <clipPath id="bgblur_0_2370_997_clip_path" transform="translate(51 50)">
          <path d="M336.872 0.5C341.721 0.500012 346.132 3.30401 348.19 7.69434L360.465 33.8809C362.358 37.92 366.417 40.5 370.878 40.5H390.5V242.5H-0.5V40.5H18.8291C23.3112 40.4998 27.3851 37.8952 29.2666 33.8271L41.3262 7.75293C43.3713 3.33105 47.799 0.500142 52.6709 0.5H336.872Z" />
        </clipPath>
      </defs>
    </svg>
  );
}
