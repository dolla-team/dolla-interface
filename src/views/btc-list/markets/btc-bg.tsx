import { BASE_TOKEN } from "@/config/btc";

const amountConfig: Record<
  string,
  {
    textColor: string;
    bgColor: string[];
    borderColor: string[];
    circleBgColor: string[];
    circleBorderColor: string[];
    textBgColor: string[];
    textBorderColor: string[];
  }
> = {
  0: {
    textColor: "linear-gradient(180deg, #FFDD70 0%, #DFBC4D 100%)",
    bgColor: ["#99761C", "#FFC42F"],
    borderColor: ["#FFE89E", "#C4A235"],
    circleBgColor: ["#FFDD70", "#DFBC4D"],
    circleBorderColor: ["#F1CE5C", "#C4A235"],
    textBgColor: ["#B67C23", "#503610"],
    textBorderColor: ["#FFC229", "#FCF3D9"]
  },
  1: {
    textColor: "linear-gradient(180deg, #ECECEC 0%, #818181 100%)",
    bgColor: ["#474747", "#A8A8A8"],
    borderColor: ["#CBCBCB", "#68748A"],
    circleBgColor: ["#ECECEC", "#818181"],
    circleBorderColor: ["#D2CDC0", "#908972"],
    textBgColor: ["#7B7B7B", "#222222"],
    textBorderColor: ["#B4B8B9", "#B4B8B9"]
  },
  2: {
    textColor: "linear-gradient(180deg, #FFE7DB 0%, #D3AC90 100%)",
    bgColor: ["#746454", "#BE9774"],
    borderColor: ["#F5D4B9", "#725A40"],
    circleBgColor: ["#E5B59F", "#AD876C"],
    circleBorderColor: ["#E9B890", "#9F723F"],
    textBgColor: ["#BE8E7F", "#45332B"],
    textBorderColor: ["#C6947E", "#FCE8D9"]
  }
};

export default function BTCBg({
  index,
  id,
  amount
}: {
  index: number;
  id: string;
  amount: string;
}) {
  const config = amountConfig[index] || amountConfig[2];
  return (
    <div className="w-[52px] h-[52px] relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="54"
        height="54"
        viewBox="0 0 54 54"
        fill="none"
        className="absolute top-0 left-0"
      >
        <rect
          x="1"
          y="1"
          width="52"
          height="52"
          rx="10"
          fill={`url(#paint0_linear_139_3_${id})`}
          stroke={`url(#paint1_linear_139_3_${id})`}
        />
        <rect
          x="4"
          y="4"
          width="46"
          height="46"
          rx="8"
          fill={`url(#paint2_linear_139_3_${id})`}
          stroke={`url(#paint3_linear_139_3_${id})`}
        />
        <mask
          id={`mask0_139_3_${id}`}
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="4"
          y="4"
          width="46"
          height="46"
        >
          <rect
            x="4"
            y="4"
            width="46"
            height="46"
            rx="8"
            fill={`url(#paint4_linear_139_3_${id})`}
          />
        </mask>
        <g mask={`url(#mask0_139_3_${id})`}>
          <path
            opacity="0.5"
            d="M29.8652 -44.4561L27.3994 26.5908L35.6865 -44.0146L38.1123 -43.6885L27.4316 26.5977L43.8418 -42.5732L46.2139 -41.9668L27.46 26.6172L51.7783 -40.1992L54.0635 -39.3232L27.499 26.6074L59.3848 -36.9219L61.5537 -35.7861L27.5254 26.6299L66.5596 -32.7832L68.582 -31.4043L27.5439 26.6621L73.208 -27.8438L75.0576 -26.2402L27.5723 26.6777L79.2393 -22.166L80.8896 -20.3594L27.5938 26.7031L84.5713 -15.8271L86.002 -13.8408L27.6006 26.7373L89.1318 -8.91309L90.3232 -6.77441L27.6533 26.7461L92.8643 -1.51953L93.7988 0.742188L27.6377 26.7881L95.7119 6.25781L96.3789 8.61328L27.6025 26.832L97.8711 15.6719L98.2139 18.0957L27.6885 26.8535L98.7275 24.8516L98.7549 27.2979L27.748 26.8936L98.5352 32.4717L98.3018 34.9072L27.6641 26.9199L97.6357 39.4795L97.1631 41.8809L27.6846 26.958L95.6895 47.5762L94.9395 49.9053L27.6396 26.9795L92.832 55.3516L91.8174 57.5781L27.6465 27.0195L89.0928 62.7412L87.8271 64.8359L27.6016 27.0332L84.5234 69.6514L83.0234 71.585L27.5977 27.0713L79.1836 75.9824L77.4697 77.7295L27.5869 27.1094L73.1455 81.6523L71.2412 83.1885L27.5557 27.1279L66.4922 86.584L64.4229 87.8896L27.5146 27.125L59.3125 90.7139L57.1055 91.7705L27.4834 27.1348L51.7021 93.9854L49.3867 94.7793L27.4521 27.1445L43.7646 96.3525L41.374 96.873L27.4229 27.168L35.6064 97.7803L33.1709 98.0215L27.3896 27.168L27.3379 98.2578L24.8896 98.2139L27.3555 27.1611L19.0693 97.7705L16.6426 97.4443L27.3203 27.168L10.9121 96.334L8.54102 95.7285L27.2939 27.1445L2.97754 93.957L0.692383 93.0811L27.2578 27.1445L-4.62891 90.6777L-6.79688 89.543L27.2236 27.1348L-11.8057 86.542L-13.8271 85.1631L27.1924 27.1172L-18.4531 81.6006L-20.3018 79.9971L27.165 27.0967L-24.4834 75.9248L-26.1348 74.1172L27.1533 27.0596L-29.8164 69.585L-31.2471 67.5986L27.1074 27.0508L-34.3789 62.6738L-35.5693 60.5352L27.1396 26.9932L-38.1084 55.2773L-39.0439 53.0146L27.0713 26.9844L-40.958 47.5L-41.625 45.1455L27.1279 26.9316L-43.1162 38.0869L-43.459 35.6631L27.1582 26.8945L-43.9727 28.9092L-44 26.4609L27.084 26.8652L-43.7812 21.2832L-43.5479 18.8467L26.9883 26.8213L-42.8799 14.2822L-42.4062 11.8799L27.1094 26.8086L-40.9346 6.18164L-40.1855 3.85059L27.0889 26.7666L-38.0762 -1.5918L-37.0615 -3.81934L27.1201 26.7422L-34.3369 -8.98438L-33.0713 -11.0791L27.1338 26.71L-29.7686 -15.8906L-28.2676 -17.8252L27.1641 26.6924L-24.4287 -22.2236L-22.7148 -23.9717L27.1738 26.6543L-18.3906 -27.8936L-16.4854 -29.4307L27.2119 26.6475L-11.7373 -32.8281L-9.66797 -34.1338L27.2441 26.6367L-4.55762 -36.958L-2.34961 -38.0156L27.2627 26.5977L3.05176 -40.2266L5.36621 -41.0215L27.2979 26.5967L10.9902 -42.5908L13.3818 -43.1113L27.334 26.6064L19.1484 -44.0234L21.585 -44.2646L27.3662 26.5967L27.418 -44.5L29.8652 -44.4561Z"
            fill={`url(#paint5_radial_139_3_${id})`}
          />
        </g>
        <circle
          cx="27"
          cy="23"
          r="14"
          fill={`url(#paint6_linear_139_3_${id})`}
          stroke={`url(#paint7_linear_139_3_${id})`}
        />
        <path
          d="M25.6992 12.7002C25.8649 12.7002 25.999 12.8343 25.999 13V15.7334C26.3002 15.7263 26.6018 15.7214 26.9004 15.7188V13C26.9004 12.8343 27.0355 12.7002 27.2012 12.7002H29.0967C29.2623 12.7003 29.3965 12.8344 29.3965 13V15.8301C30.5228 15.9481 31.5462 16.1936 32.334 16.6855C33.2038 17.2288 33.7683 18.0605 33.8818 19.2734L33.9023 19.5908C33.9283 20.3174 33.7871 20.9313 33.5049 21.4414C33.2964 21.8182 33.0161 22.1272 32.6865 22.3799C33.3452 22.6199 33.9096 22.9777 34.3184 23.5068C34.8582 24.2058 35.0929 25.1569 34.9775 26.4072L34.9766 26.4082C34.8275 27.9831 34.1843 29.0219 33.1299 29.6738C32.1612 30.2728 30.8753 30.5229 29.3965 30.623V33C29.3965 33.1656 29.2623 33.2997 29.0967 33.2998H27.2012C27.0355 33.2998 26.9014 33.1657 26.9014 33V30.6914C26.6085 30.6911 26.3066 30.6893 25.999 30.6846V33C25.999 33.1657 25.8649 33.2998 25.6992 33.2998H23.8037C23.638 33.2998 23.5039 33.1657 23.5039 33V30.6396C23.424 30.6389 23.3231 30.6384 23.1963 30.6377C22.6783 30.6346 21.7279 30.6309 20 30.6309C19.9117 30.6308 19.8275 30.5919 19.7705 30.5244C19.7138 30.457 19.6894 30.3681 19.7041 30.2812L20.0859 28.0283L20.0996 27.9756C20.1427 27.8574 20.257 27.7761 20.3867 27.7783C20.737 27.7845 21.0146 27.7961 21.2646 27.7979C21.5117 27.7996 21.694 27.7911 21.8311 27.7646C21.9648 27.7389 22.029 27.7013 22.0654 27.6641C22.1002 27.6285 22.1389 27.5622 22.1621 27.4199V18.9922C22.1242 18.805 22.0641 18.6969 21.9971 18.6279C21.9274 18.5564 21.8246 18.4999 21.6582 18.4619C21.4879 18.4231 21.2698 18.4075 20.9883 18.4053C20.7064 18.4031 20.386 18.4142 20.0049 18.4209C19.9247 18.4222 19.8473 18.3911 19.79 18.335C19.7326 18.2786 19.7002 18.2006 19.7002 18.1201V16.1016C19.7003 16.022 19.7318 15.9458 19.7881 15.8896C19.8445 15.8334 19.9213 15.8015 20.001 15.8018C21.9889 15.8111 22.8589 15.8179 23.5039 15.8066V13C23.5039 12.8343 23.638 12.7002 23.8037 12.7002H25.6992ZM28.7607 24.3516C27.8056 24.1711 26.7403 24.2102 26.0361 24.2246V27.7939C26.7367 27.8038 27.8046 27.8277 28.7578 27.6387C29.3074 27.5296 29.7842 27.3548 30.1182 27.0918C30.4388 26.8392 30.6367 26.4999 30.6367 26.0107C30.6367 25.4961 30.436 25.1461 30.1172 24.8916C29.7847 24.6263 29.3095 24.4553 28.7607 24.3516ZM28.2881 18.6621C27.5019 18.5039 26.631 18.5356 26.0361 18.5498V21.7383C26.6272 21.7475 27.5011 21.7638 28.2852 21.5986C28.7483 21.501 29.146 21.3457 29.4229 21.1143C29.6874 20.8931 29.8555 20.5921 29.8555 20.1514C29.8554 19.6815 29.6839 19.3681 29.4209 19.1436C29.1455 18.9085 28.75 18.7551 28.2881 18.6621Z"
          fill={`url(#paint8_linear_139_3_${id})`}
          stroke={`url(#paint9_linear_139_3_${id})`}
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient
            id={`paint0_linear_139_3_${id}`}
            x1="27"
            y1="1"
            x2="27"
            y2="53"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={config.bgColor[0]} />
            <stop offset="1" stopColor={config.bgColor[1]} />
          </linearGradient>
          <linearGradient
            id={`paint1_linear_139_3_${id}`}
            x1="27"
            y1="53"
            x2="27"
            y2="1"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={config.borderColor[0]} />
            <stop offset="1" stopColor={config.borderColor[1]} />
          </linearGradient>
          <linearGradient
            id={`paint2_linear_139_3_${id}`}
            x1="27"
            y1="4"
            x2="27"
            y2="50"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={config.bgColor[1]} />
            <stop offset="1" stopColor={config.bgColor[0]} />
          </linearGradient>
          <linearGradient
            id={`paint3_linear_139_3_${id}`}
            x1="27"
            y1="50"
            x2="27"
            y2="4"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={config.borderColor[0]} />
            <stop offset="1" stopColor={config.borderColor[1]} />
          </linearGradient>
          <linearGradient
            id={`paint4_linear_139_3_${id}`}
            x1="27"
            y1="4"
            x2="27"
            y2="50"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={config.bgColor[1]} />
            <stop offset="1" stopColor={config.bgColor[0]} />
          </linearGradient>
          <radialGradient
            id={`paint5_radial_139_3_${id}`}
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(27.3774 26.8789) rotate(92.7588) scale(34.2862 34.2855)"
          >
            <stop stopColor={config.circleBorderColor[0]} />
            <stop offset="1" stopColor={config.circleBorderColor[1]} />
          </radialGradient>
          <linearGradient
            id={`paint6_linear_139_3_${id}`}
            x1="27"
            y1="9"
            x2="27"
            y2="37"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={config.circleBgColor[0]} />
            <stop offset="1" stopColor={config.circleBgColor[1]} />
          </linearGradient>
          <linearGradient
            id={`paint7_linear_139_3_${id}`}
            x1="27"
            y1="37"
            x2="27"
            y2="9"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={config.borderColor[0]} />
            <stop offset="1" stopColor={config.borderColor[1]} />
          </linearGradient>
          <linearGradient
            id={`paint8_linear_139_3_${id}`}
            x1="27.353"
            y1="13"
            x2="27.353"
            y2="33"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={config.textBgColor[0]} />
            <stop offset="1" stopColor={config.textBgColor[1]} />
          </linearGradient>
          <linearGradient
            id={`paint9_linear_139_3_${id}`}
            x1="27.353"
            y1="33"
            x2="27.353"
            y2="13"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={config.textBorderColor[0]} />
            <stop offset="1" stopColor={config.textBorderColor[1]} />
          </linearGradient>
        </defs>
      </svg>
      <span
        className="text-[8px] font-semibold absolute bottom-[3px] w-full text-center"
        style={{
          background: config.textColor,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        {amount} {BASE_TOKEN.symbol}
      </span>
    </div>
  );
}
