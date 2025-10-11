export default function ShareBtn() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      className="button"
    >
      <foreignObject x="-50" y="-50" width="132" height="132">
        <div
          style={{
            backdropFilter: "blur(25px)",
            clipPath: "url(#bgblur_0_2267_3979_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="8.5"
        fill="white"
        fillOpacity="0.1"
        stroke="#3B3951"
      />
      <path
        d="M10 17.2333V22H22V17.2333M15.8065 18.1V9M15.8065 9L12.3226 12.0333M15.8065 9L19.2903 12.0333"
        stroke="#FFE9B2"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <clipPath
          id="bgblur_0_2267_3979_clip_path"
          transform="translate(50 50)"
        >
          <rect x="0.5" y="0.5" width="31" height="31" rx="8.5" />
        </clipPath>
      </defs>
    </svg>
  );
}
