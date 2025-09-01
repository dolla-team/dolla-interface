export default function Level() {
  return (
    <div className="mt-[16px]">
      <div className="flex justify-between items-center text-white">
        <div className="text-[10px]">Level</div>
        <div className="flex items-center gap-[6px]">
          <LevelIcon />
          <span className="text-[12px]">Lv. 1</span>
        </div>
      </div>
      <div className="mt-[6px] w-[254px] h-[6px] rounded-[3px] bg-[#F2F2F21A] backdrop-blur-[25px]">
        <div
          className="h-full bg-white rounded-[3px]"
          style={{ width: "50%" }}
        />
      </div>
    </div>
  );
}

const LevelIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
    >
      <path
        d="M6.75 1.14453C7.5235 0.697949 8.4765 0.697949 9.25 1.14453L14.1777 3.98926C14.9511 4.43577 15.4276 5.26129 15.4277 6.1543V11.8457C15.4276 12.7387 14.9511 13.5642 14.1777 14.0107L9.25 16.8555C8.4765 17.3021 7.5235 17.3021 6.75 16.8555L1.82227 14.0107C1.04888 13.5642 0.572409 12.7387 0.572266 11.8457V6.1543C0.572409 5.26129 1.04888 4.43577 1.82227 3.98926L6.75 1.14453Z"
        fill="url(#paint0_linear_3488_965)"
        stroke="url(#paint1_linear_3488_965)"
      />
      <path
        d="M7.10332 5.34331C7.47013 4.60006 8.52997 4.60006 8.89679 5.34331L9.37606 6.31441C9.52172 6.60956 9.80328 6.81412 10.129 6.86145L11.2007 7.01718C12.0209 7.13636 12.3484 8.14433 11.7549 8.72287L10.9794 9.47877C10.7437 9.70851 10.6362 10.0395 10.6918 10.3639L10.8749 11.4313C11.015 12.2482 10.1576 12.8711 9.42393 12.4854L8.46539 11.9815C8.17407 11.8283 7.82603 11.8283 7.53471 11.9815L6.57617 12.4854C5.84254 12.8711 4.98511 12.2482 5.12522 11.4312L5.30829 10.3639C5.36393 10.0395 5.25638 9.70851 5.02069 9.47877L4.24522 8.72287C3.6517 8.14433 3.97921 7.13636 4.79943 7.01718L5.87111 6.86145C6.19682 6.81412 6.47838 6.60956 6.62405 6.31441L7.10332 5.34331Z"
        fill="white"
      />
      <defs>
        <linearGradient
          id="paint0_linear_3488_965"
          x1="8"
          y1="1"
          x2="8"
          y2="17"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6F37FF" />
          <stop offset="1" stopColor="#432199" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_3488_965"
          x1="8"
          y1="1"
          x2="8"
          y2="17"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#999999" />
        </linearGradient>
      </defs>
    </svg>
  );
};
