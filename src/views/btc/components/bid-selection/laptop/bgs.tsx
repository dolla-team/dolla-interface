export const ProvablyFairBg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="194"
      height="57"
      viewBox="0 0 194 57"
      fill="none"
      className="absolute top-0 left-0"
    >
      <path
        d="M2 26.9914C2 22.9873 4.94615 19.6043 8.91689 19.0883C32.4767 16.0268 111.661 6.09788 175.274 2.37332C179.162 2.14566 182.629 4.77602 183.489 8.57479L191.789 45.2334C192.922 50.2378 189.117 55 183.986 55H10C5.58173 55 2 51.4183 2 47V26.9914Z"
        fill="url(#paint0_linear_1746_1165)"
        fillOpacity="0.2"
      />
      <path
        d="M175.216 1.375C179.597 1.11866 183.497 4.08233 184.464 8.35352L192.764 45.0127C194.038 50.6426 189.759 55.9999 183.986 56H10C5.02944 56 1 51.9706 1 47V26.9912C1.00008 22.4893 4.3146 18.678 8.78809 18.0967C32.3487 15.035 111.564 5.10182 175.216 1.375Z"
        stroke="url(#paint1_linear_1746_1165)"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1746_1165"
          x1="98"
          y1="3.76667"
          x2="98"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DEDEDE" />
          <stop offset="1" stopColor="#555555" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1746_1165"
          x1="98"
          y1="3.76667"
          x2="98"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9F9F9F" />
          <stop offset="1" stopColor="#323232" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const BalanceBg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="192"
      height="63"
      viewBox="0 0 192 63"
      fill="none"
      className="absolute top-0 left-0"
    >
      <foreignObject x="-50" y="-49.5984" width="291.4" height="162.598">
        <div
          style={{
            backdropFilter: "blur(25px)",
            clipPath: "url(#bgblur_0_4184_1187_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <g data-figma-bg-blur-radius="50">
        <path
          d="M1 11.4018C1 5.72451 5.72085 1.18602 11.3937 1.40956L164.874 7.45734C168.633 7.60546 171.991 9.85053 173.564 13.2676L189.471 47.818C192.521 54.4433 187.681 62 180.387 62H11C5.47715 62 1 57.5228 1 52V11.4018Z"
          fill="#F2F2F2"
          fillOpacity="0.1"
        />
        <path
          d="M11.4131 0.910156L164.894 6.95801C168.84 7.11353 172.366 9.47074 174.018 13.0586L189.925 47.6084C193.128 54.565 188.045 62.5 180.387 62.5H11C5.20101 62.5 0.5 57.799 0.5 52V11.4014C0.50024 5.44053 5.45685 0.675638 11.4131 0.910156Z"
          stroke="#F2F2F2"
          strokeOpacity="0.2"
        />
      </g>
      <defs>
        <clipPath
          id="bgblur_0_4184_1187_clip_path"
          transform="translate(50 49.5984)"
        >
          <path d="M1 11.4018C1 5.72451 5.72085 1.18602 11.3937 1.40956L164.874 7.45734C168.633 7.60546 171.991 9.85053 173.564 13.2676L189.471 47.818C192.521 54.4433 187.681 62 180.387 62H11C5.47715 62 1 57.5228 1 52V11.4018Z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const Bg100 = ({ active }: { active: boolean }) => {
  return active ? (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="113"
        height="73"
        viewBox="0 0 113 73"
        fill="none"
        className="absolute top-0 left-0"
      >
        <path
          d="M8.69963 14.8022C9.46174 10.2295 13.2667 6.78013 17.892 6.46881L101.586 0.835544C107.961 0.40644 113.098 5.98465 112.146 12.303L104.282 64.49C103.545 69.3822 99.3414 73 94.394 73H10.8046C4.62521 73 -0.0752212 67.4513 0.940665 61.356L8.69963 14.8022Z"
          fill="#FFC42F"
        />
      </svg>
      <img
        className="absolute bottom-[-10px] left-0"
        src="/btc/bid100.gif"
        alt="bid 100"
      />
    </>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="115"
      height="75"
      viewBox="0 0 115 75"
      fill="none"
      className="absolute top-0 left-0"
    >
      <foreignObject x="-49.1982" y="-49.1877" width="213.458" height="174.188">
        <div
          style={{
            backdropFilter: "blur(25px)",
            clipPath: "url(#bgblur_0_4184_1332_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <g data-figma-bg-blur-radius="50">
        <path
          d="M9.69963 15.8022C10.4617 11.2295 14.2667 7.78013 18.892 7.46881L102.586 1.83554C108.961 1.40644 114.098 6.98465 113.146 13.303L105.282 65.49C104.545 70.3822 100.341 74 95.394 74H11.8046C5.62521 74 0.924779 68.4513 1.94067 62.356L9.69963 15.8022Z"
          fill="#F2F2F2"
          fill-opacity="0.1"
        />
        <path
          d="M102.553 1.33691C109.247 0.886415 114.64 6.74369 113.641 13.3779L105.776 65.5645C105.002 70.7013 100.588 74.5 95.3936 74.5H11.8047C5.31632 74.5 0.380585 68.6735 1.44727 62.2734L9.20605 15.7197C10.0064 10.9185 14.0019 7.29661 18.8584 6.96973L102.553 1.33691Z"
          stroke="#F2F2F2"
          stroke-opacity="0.2"
        />
      </g>
      <defs>
        <clipPath
          id="bgblur_0_4184_1332_clip_path"
          transform="translate(49.1982 49.1877)"
        >
          <path d="M9.69963 15.8022C10.4617 11.2295 14.2667 7.78013 18.892 7.46881L102.586 1.83554C108.961 1.40644 114.098 6.98465 113.146 13.303L105.282 65.49C104.545 70.3822 100.341 74 95.394 74H11.8046C5.62521 74 0.924779 68.4513 1.94067 62.356L9.69963 15.8022Z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const Bg50 = ({ active }: { active: boolean }) => {
  return active ? (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="112"
        height="65"
        viewBox="0 0 112 65"
        fill="none"
        className="absolute top-0 left-0"
      >
        <path
          d="M7.66889 13.8535C8.44784 9.25775 12.2987 5.80969 16.9523 5.54121L100.661 0.711868C107.013 0.345376 112.088 5.92673 111.121 12.2158L104.305 56.5206C103.554 61.3989 99.3565 65 94.4208 65H10.8375C4.64701 65 -0.0563377 59.4324 0.97815 53.3289L7.66889 13.8535Z"
          fill="#FFC42F"
        />
      </svg>
      <img
        className="absolute bottom-0 left-0"
        src="/btc/bid50.gif"
        alt="bid 50"
      />
    </>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="114"
      height="67"
      viewBox="0 0 114 67"
      fill="none"
      className="absolute top-0 left-0"
    >
      <foreignObject x="-49.165" y="-49.3053" width="212.405" height="166.305">
        <div
          style={{
            backdropFilter: "blur(25px)",
            clipPath: "url(#bgblur_0_4184_1331_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <g data-figma-bg-blur-radius="50">
        <path
          d="M8.66889 14.8535C9.44784 10.2578 13.2987 6.80969 17.9523 6.54121L101.661 1.71187C108.013 1.34538 113.088 6.92673 112.121 13.2158L105.305 57.5206C104.554 62.3989 100.357 66 95.4208 66H11.8375C5.64701 66 0.943662 60.4324 1.97815 54.3289L8.66889 14.8535Z"
          fill="#F2F2F2"
          fillOpacity="0.1"
        />
        <path
          d="M101.632 1.21289C108.302 0.828073 113.631 6.68842 112.615 13.292L105.799 57.5967C105.011 62.7189 100.603 66.5 95.4209 66.5H11.8379C5.33784 66.5 0.39914 60.6538 1.48535 54.2451L8.17578 14.7695C8.99384 9.94417 13.0377 6.32388 17.9238 6.04199L101.632 1.21289Z"
          stroke="#F2F2F2"
          strokeOpacity="0.2"
        />
      </g>
      <defs>
        <clipPath
          id="bgblur_0_4184_1331_clip_path"
          transform="translate(49.165 49.3053)"
        >
          <path d="M8.66889 14.8535C9.44784 10.2578 13.2987 6.80969 17.9523 6.54121L101.661 1.71187C108.013 1.34538 113.088 6.92673 112.121 13.2158L105.305 57.5206C104.554 62.3989 100.357 66 95.4208 66H11.8375C5.64701 66 0.943662 60.4324 1.97815 54.3289L8.66889 14.8535Z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const Bg10 = ({ active }: { active: boolean }) => {
  return active ? (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="111"
        height="61"
        viewBox="0 0 111 61"
        fill="none"
        className="absolute top-0 left-0"
      >
        <path
          d="M6.57946 15.5288C7.41763 11.0866 11.1318 7.75909 15.6391 7.41238L99.3049 0.976543C105.768 0.479386 110.989 6.16809 109.94 12.5648L103.374 52.6177C102.582 57.4517 98.4043 61 93.5059 61H10.0632C3.79722 61 -0.92515 55.3033 0.236619 49.1459L6.57946 15.5288Z"
          fill="#FFC42F"
        />
      </svg>
      <img
        className="absolute bottom-0 left-0"
        src="/btc/bid10.gif"
        alt="bid 10"
      />
    </>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="113"
      height="63"
      viewBox="0 0 113 63"
      fill="none"
      className="absolute top-0 left-0"
    >
      <foreignObject x="-49.9399" y="-49.0538" width="212.015" height="162.054">
        <div
          style={{
            backdropFilter: "blur(25px)",
            clipPath: "url(#bgblur_0_4184_1330_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <g data-figma-bg-blur-radius="50">
        <path
          d="M7.57946 16.5288C8.41763 12.0866 12.1318 8.75909 16.6391 8.41238L100.305 1.97654C106.768 1.47939 111.989 7.16809 110.94 13.5648L104.374 53.6177C103.582 58.4517 99.4043 62 94.5059 62H11.0632C4.79722 62 0.0748504 56.3033 1.23662 50.1459L7.57946 16.5288Z"
          fill="#F2F2F2"
          fillOpacity="0.1"
        />
        <path
          d="M100.267 1.47754C107.053 0.955561 112.535 6.92902 111.434 13.6455L104.867 53.6982C104.035 58.7739 99.6492 62.5 94.5059 62.5H11.0635C4.48416 62.5 -0.474739 56.518 0.745117 50.0527L7.08789 16.4365C7.96795 11.7722 11.868 8.2782 16.6006 7.91406L100.267 1.47754Z"
          stroke="#F2F2F2"
          strokeOpacity="0.2"
        />
      </g>
      <defs>
        <clipPath
          id="bgblur_0_4184_1330_clip_path"
          transform="translate(49.9399 49.0538)"
        >
          <path d="M7.57946 16.5288C8.41763 12.0866 12.1318 8.75909 16.6391 8.41238L100.305 1.97654C106.768 1.47939 111.989 7.16809 110.94 13.5648L104.374 53.6177C103.582 58.4517 99.4043 62 94.5059 62H11.0632C4.79722 62 0.0748504 56.3033 1.23662 50.1459L7.57946 16.5288Z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const Bg5 = ({ active }: { active: boolean }) => {
  return active ? (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="114"
        height="56"
        viewBox="0 0 114 56"
        fill="none"
        className="absolute top-0 left-0"
      >
        <path
          d="M11.297 6.358C12.2864 2.66412 15.7517 0.187008 19.567 0.4463L106.323 6.34231C111.34 6.68331 114.802 11.5145 113.513 16.3754L104.578 50.0515C103.648 53.5583 100.474 56 96.8457 56H8.42488C3.16494 56 -0.663643 51.0109 0.697292 45.9301L11.297 6.358Z"
          fill="url(#paint0_linear_2716_3441)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_2716_3441"
            x1="53.6043"
            y1="0"
            x2="53.6043"
            y2="56"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFF698" />
            <stop offset="1" stopColor="#FFC42F" />
          </linearGradient>
        </defs>
      </svg>
      <img
        className="absolute bottom-0 left-0"
        src="/btc/bid5.gif"
        alt="bid 5"
      />
    </>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="118"
      height="60"
      viewBox="0 0 118 60"
      fill="none"
      className="absolute top-0 left-0"
    >
      <path
        d="M13.297 8.358C14.2864 4.66412 17.7517 2.18701 21.567 2.4463L108.323 8.34231C113.34 8.68331 116.802 13.5145 115.513 18.3754L106.578 52.0515C105.648 55.5583 102.474 58 98.8457 58H10.4249C5.16494 58 1.33636 53.0109 2.69729 47.9301L13.297 8.358Z"
        fill="url(#paint0_linear_1746_1735)"
        fillOpacity="0.2"
      />
      <path
        d="M12.3311 8.09961C13.4442 3.94401 17.3426 1.15656 21.6348 1.44824L108.391 7.34473C114.035 7.72848 117.93 13.1634 116.479 18.6318L107.545 52.3076C106.498 56.2528 102.927 59 98.8457 59H10.4248C4.50742 59 0.2004 53.3868 1.73145 47.6709L12.3311 8.09961Z"
        stroke="url(#paint1_linear_1746_1735)"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1746_1735"
          x1="59"
          y1="3.86667"
          x2="59"
          y2="58"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DEDEDE" />
          <stop offset="1" stopColor="#555555" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_1746_1735"
          x1="59"
          y1="3.86667"
          x2="59"
          y2="58"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9F9F9F" />
          <stop offset="1" stopColor="#323232" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const Bg1 = ({ active }: { active: boolean }) => {
  return active ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="117"
      height="53"
      viewBox="0 0 117 53"
      fill="none"
      className="absolute top-0 left-0"
    >
      <path
        d="M12.5733 12.5814C14.0639 9.153 17.3424 6.84234 21.0724 6.59128L106.106 0.867885C112.633 0.428571 117.817 6.2711 116.604 12.6994L110.537 44.8541C109.646 49.5786 105.518 53 100.71 53H10.2521C3.05044 53 -1.79008 45.6172 1.08142 39.0127L12.5733 12.5814Z"
        fill="#FFC42F"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="119"
      height="55"
      viewBox="0 0 119 55"
      fill="none"
      className="absolute top-0 left-0"
    >
      <foreignObject x="-49.7598" y="-49.1555" width="218.541" height="154.156">
        <div
          style={{
            backdropFilter: "blur(25px)",
            clipPath: "url(#bgblur_0_4184_1329_clip_path)",
            height: "100%",
            width: "100%"
          }}
        ></div>
      </foreignObject>
      <g data-figma-bg-blur-radius="50">
        <path
          d="M13.5733 13.5814C15.0639 10.153 18.3424 7.84234 22.0724 7.59128L107.106 1.86788C113.633 1.42857 118.817 7.2711 117.604 13.6994L111.537 45.8541C110.646 50.5786 106.518 54 101.71 54H11.2521C4.05044 54 -0.790082 46.6172 2.08142 40.0127L13.5733 13.5814Z"
          fill="#F2F2F2"
          fillOpacity="0.1"
        />
        <path
          d="M107.072 1.36914C113.925 0.907946 119.369 7.0424 118.096 13.792L112.028 45.9473C111.092 50.9078 106.758 54.5 101.71 54.5H11.252C3.69029 54.4999 -1.39198 46.7481 1.62305 39.8135L13.1152 13.3818C14.6805 9.78219 18.1227 7.35638 22.0391 7.09277L107.072 1.36914Z"
          stroke="#F2F2F2"
          strokeOpacity="0.2"
        />
      </g>
      <defs>
        <clipPath
          id="bgblur_0_4184_1329_clip_path"
          transform="translate(49.7598 49.1555)"
        >
          <path d="M13.5733 13.5814C15.0639 10.153 18.3424 7.84234 22.0724 7.59128L107.106 1.86788C113.633 1.42857 118.817 7.2711 117.604 13.6994L111.537 45.8541C110.646 50.5786 106.518 54 101.71 54H11.2521C4.05044 54 -0.790082 46.6172 2.08142 40.0127L13.5733 13.5814Z" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const Bg = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1512"
      height="192"
      viewBox="0 0 1512 192"
      fill="none"
      className={className}
    >
      <g filter="url(#filter0_d_4184_1185)">
        <path
          d="M531.943 71.2216L0 32V192H1512V32L979.061 71.2242C972.455 71.7095 966.517 75.434 963.205 81.1704L936.773 126.952C933.201 133.14 926.598 136.952 919.453 136.952H591.547C584.402 136.952 577.799 133.14 574.227 126.952L547.793 81.1675C544.482 75.4327 538.547 71.7085 531.943 71.2216Z"
          fill="url(#paint0_radial_4184_1185)"
          shapeRendering="crispEdges"
        />
        <path
          d="M1512 32L979.061 71.2242C972.455 71.7095 966.517 75.434 963.205 81.1704L936.773 126.952C933.201 133.14 926.598 136.952 919.453 136.952H591.547C584.402 136.952 577.799 133.14 574.227 126.952L547.793 81.1675C544.482 75.4327 538.547 71.7085 531.943 71.2216L0 32"
          stroke="url(#paint1_linear_4184_1185)"
          strokeWidth="1"
          shapeRendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_4184_1185"
          x="-31"
          y="0.923584"
          width="1575"
          height="644.076"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="15" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_4184_1185"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_4184_1185"
            result="shape"
          />
        </filter>
        <radialGradient
          id="paint0_radial_4184_1185"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(756.5 137) rotate(-90) scale(184.5 445.97)"
        >
          <stop stopColor="#423A33" />
          <stop offset="1" />
        </radialGradient>
        <linearGradient
          id="paint1_linear_4184_1185"
          x1="756.5"
          y1="32"
          x2="756.5"
          y2="137"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#614D2D" stopOpacity="0" />
          <stop offset="1" stopColor="#C79E5C" />
        </linearGradient>
      </defs>
    </svg>
  );
};
