import Avatar from "@/components/avatar";
import PointIcon from "@/components/icons/point-icon";
import { addThousandSeparator } from "@/utils/format/number";
import clsx from "clsx";
import Confetti from "@/components/confetti";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth";
import CloseIcon from "@/components/icons/close";

export default function Winner({
  points,
  onClose
}: {
  points: number;
  onClose: () => void;
}) {
  const { userInfo } = useAuth();
  return (
    <>
      <button
        className="fixed right-[20px] top-[20px] z-[110] button"
        onClick={onClose}
      >
        <CloseIcon size={36} />
      </button>
      <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-[50] flex items-center justify-center">
        <div className="absolute z-[1] left-0 top-0 w-full h-full backdrop-blur-[10px] bg-[radial-gradient(44.79%_52.28%_at_50%_50%,rgba(255,183,38,0.6)_0%,rgba(0,0,0,0.6)_100%)]" />
        <img
          src="/btc/winner.gif"
          alt="Winner"
          className="w-[500px] h-[500px] z-[2] absolute right-0 bottom-0"
        />
        <img
          src="/logo.svg"
          alt="dolla"
          className="w-[78px] h-[39px] absolute left-[50%] top-[30px] z-[20] -translate-x-1/2"
        />
        <div className="relative z-[3] w-full h-full flex flex-col items-center justify-center">
          <div className="text-white text-[32px] font-[BlackHanSans] mb-[30px]">
            Congrats!
          </div>
          <div
            className={clsx(
              "relative z-[3] cursor-pointer perspective-[1000px] w-[310px] h-[310px] rounded-full shadow-[0px_0px_30px_6px_rgba(250,252,129,0.30)]"
            )}
          >
            <motion.div
              className="relative w-full h-full transition-transform duration-500 ease-in-out flex items-center justify-center"
              style={{
                transformStyle: "preserve-3d"
              }}
              animate={{
                rotateY: 180
              }}
            >
              {/* Front face (Heads) */}
              <div className="absolute inset-0 w-full h-full rounded-full border-[3px] border-[#DD9000] bg-[linear-gradient(180deg,_#FFC93F_0%,_#FFDC84_50%,_#DEAF37_100%)]">
                <div className="w-[240px] h-[240px] flex items-center justify-center border-[3px] border-[#DD9000] mt-[32px] ml-[32px] shadow-[4px_7px_0px_0px_rgba(0,0,0,0.25)_inset] bg-[linear-gradient(90deg,_#FFCE52_0%,_#F6C240_100%)] rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="245"
                    height="289"
                    viewBox="0 0 245 289"
                    fill="none"
                  >
                    <g filter="url(#filter0_d_2069_4912)">
                      <path
                        d="M173.121 112.749C174.31 124.776 169.983 133.3 160.136 138.322C167.867 140.172 173.649 143.575 177.482 148.531C181.314 153.487 182.801 160.558 181.942 169.743C181.479 174.435 180.405 178.564 178.721 182.133C177.036 185.701 174.904 188.642 172.327 190.954C169.75 193.267 166.546 195.2 162.712 196.753C158.88 198.306 154.865 199.445 150.67 200.172C146.473 200.898 141.666 201.394 136.248 201.658V226.933H120.983V202.055C115.697 202.055 111.666 202.022 108.891 201.955V226.933H93.6279V201.658C92.4387 201.658 90.6545 201.641 88.2754 201.608C85.8961 201.575 84.0791 201.558 82.8242 201.558H63L66.0729 183.42H77.0756C80.3793 183.42 82.2959 181.735 82.8242 178.364V109.974C81.9654 105.48 79.025 103.234 74.0027 103.234H63V86.9779L84.0135 87.0773C88.2426 87.0773 91.4479 87.0445 93.6281 86.9779V62H108.893V86.4824C114.311 86.35 118.342 86.2844 120.985 86.2844V62H136.25V86.9779C141.47 87.4406 146.095 88.184 150.126 89.208C154.157 90.232 157.891 91.7187 161.327 93.668C164.763 95.6172 167.489 98.1945 169.505 101.399C171.519 104.604 172.725 108.388 173.121 112.749ZM151.81 166.768C151.81 164.388 151.315 162.274 150.323 160.424C149.332 158.574 148.109 157.054 146.656 155.864C145.203 154.675 143.303 153.667 140.957 152.841C138.612 152.015 136.448 151.404 134.465 151.007C132.483 150.611 130.038 150.314 127.131 150.116C124.223 149.918 121.943 149.818 120.291 149.818C118.639 149.818 116.508 149.851 113.898 149.918C111.288 149.983 109.719 150.017 109.19 150.017V183.519C109.719 183.519 110.942 183.536 112.857 183.569C114.774 183.602 116.359 183.619 117.615 183.619C118.871 183.619 120.621 183.569 122.868 183.471C125.115 183.372 127.047 183.24 128.666 183.074C130.285 182.909 132.168 182.629 134.317 182.232C136.464 181.836 138.298 181.373 139.818 180.844C141.337 180.315 142.906 179.621 144.525 178.762C146.144 177.903 147.449 176.912 148.44 175.788C149.431 174.665 150.241 173.344 150.868 171.824C151.495 170.304 151.81 168.619 151.81 166.768ZM144.773 119.587C144.773 117.407 144.36 115.474 143.534 113.789C142.708 112.104 141.7 110.716 140.511 109.625C139.322 108.535 137.736 107.61 135.753 106.85C133.771 106.09 131.954 105.545 130.302 105.214C128.65 104.884 126.618 104.619 124.206 104.421C121.794 104.223 119.878 104.14 118.458 104.173C117.037 104.206 115.253 104.239 113.105 104.272C110.958 104.305 109.652 104.322 109.19 104.322V134.751C109.521 134.751 110.661 134.768 112.609 134.801C114.559 134.834 116.095 134.834 117.219 134.801C118.342 134.768 119.994 134.702 122.174 134.603C124.354 134.504 126.171 134.322 127.625 134.058C129.079 133.793 130.781 133.43 132.73 132.967C134.68 132.504 136.282 131.894 137.537 131.133C138.793 130.373 140.015 129.481 141.204 128.457C142.394 127.433 143.286 126.161 143.88 124.641C144.474 123.122 144.773 121.438 144.773 119.587Z"
                        fill="white"
                      />
                      <path
                        d="M109.893 61V85.459C114.18 85.3576 117.546 85.3018 119.985 85.2891V61H137.25V86.0654C142.141 86.5357 146.517 87.2597 150.373 88.2393C154.486 89.2841 158.303 90.8025 161.82 92.7979C165.171 94.6983 167.884 97.1825 169.947 100.246L170.352 100.866V100.867C172.46 104.223 173.707 108.16 174.116 112.65C174.725 118.804 173.929 124.142 171.658 128.614C169.723 132.427 166.744 135.548 162.768 137.991C169.487 139.984 174.683 143.277 178.272 147.92C182.319 153.153 183.81 160.516 182.938 169.836L182.937 169.841C182.465 174.625 181.367 178.87 179.625 182.56C177.891 186.232 175.684 189.285 172.995 191.698C170.484 193.951 167.419 195.841 163.815 197.377L163.088 197.68C159.188 199.261 155.103 200.419 150.84 201.157C146.843 201.849 142.311 202.328 137.248 202.604V227.933H119.983V203.053C115.78 203.049 112.415 203.022 109.891 202.974V227.934H92.6279V202.652C91.5071 202.646 90.0512 202.632 88.2617 202.607C85.8834 202.575 84.072 202.559 82.8242 202.559H61.8164L62.0137 201.392L65.0869 183.253L65.2275 182.42H77.0752C78.5571 182.42 79.6029 182.044 80.3301 181.405C81.0503 180.772 81.5789 179.772 81.8242 178.278V110.076C81.4227 108.057 80.5825 106.641 79.3682 105.713C78.1253 104.763 76.3721 104.233 74.0029 104.233H62V85.9736L63.0049 85.9775L84.0166 86.0762C87.65 86.0762 90.5193 86.0498 92.6279 86.001V61H109.893ZM120.291 150.818C118.651 150.818 116.529 150.851 113.924 150.917H113.923C112.263 150.959 111.017 150.985 110.19 151.001V182.528C110.844 182.536 111.739 182.55 112.874 182.569C114.788 182.602 116.367 182.619 117.615 182.619C118.849 182.619 120.582 182.57 122.824 182.472C125.058 182.374 126.97 182.242 128.564 182.079C130.149 181.917 132.005 181.642 134.135 181.248C136.248 180.858 138.031 180.407 139.488 179.899H139.489C140.955 179.39 142.477 178.718 144.057 177.879L144.617 177.568C145.888 176.832 146.906 176.016 147.69 175.127C148.602 174.094 149.355 172.87 149.943 171.443L150.146 170.915C150.584 169.666 150.811 168.286 150.811 166.768C150.811 164.531 150.346 162.583 149.442 160.896C148.506 159.149 147.363 157.735 146.023 156.639C144.683 155.542 142.894 154.583 140.625 153.784C138.315 152.971 136.196 152.374 134.269 151.988V151.987C132.343 151.603 129.944 151.31 127.062 151.113C124.163 150.916 121.909 150.818 120.291 150.818ZM118.48 105.173C117.056 105.206 115.269 105.239 113.121 105.272H113.12C111.853 105.292 110.875 105.304 110.19 105.312V133.766C110.774 133.774 111.587 133.784 112.626 133.802C114.569 133.834 116.088 133.834 117.189 133.802C118.304 133.769 119.95 133.703 122.129 133.604L122.919 133.563C124.72 133.46 126.226 133.296 127.446 133.074C128.878 132.814 130.561 132.454 132.499 131.994C134.382 131.547 135.879 130.968 137.02 130.277L137.471 129.998C138.519 129.332 139.545 128.566 140.552 127.699C141.612 126.786 142.412 125.651 142.949 124.277C143.493 122.888 143.772 121.329 143.772 119.587C143.772 117.535 143.384 115.756 142.636 114.229C141.856 112.639 140.919 111.356 139.835 110.362C138.763 109.379 137.296 108.512 135.396 107.783V107.784C133.453 107.039 131.691 106.512 130.105 106.194V106.193C128.504 105.873 126.512 105.614 124.124 105.418C121.726 105.221 119.849 105.141 118.48 105.173Z"
                        stroke="url(#paint0_linear_2069_4912)"
                        strokeWidth="2"
                      />
                    </g>
                    <defs>
                      <filter
                        id="filter0_d_2069_4912"
                        x="0.632812"
                        y="0"
                        width="243.545"
                        height="288.934"
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
                        <feGaussianBlur stdDeviation="30" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_2069_4912"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_2069_4912"
                          result="shape"
                        />
                      </filter>
                      <linearGradient
                        id="paint0_linear_2069_4912"
                        x1="122.589"
                        y1="62"
                        x2="122.589"
                        y2="226.933"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#DD9000" />
                        <stop offset="1" stopColor="#FFB936" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Back face (Tails) */}
              <div
                className="absolute top-0 left-0 w-full h-full rounded-full backface-hidden flex items-center justify-center"
                style={{
                  transform: `rotateY(180deg) translateZ(1px)`
                }}
              >
                <Avatar
                  size={240}
                  address={userInfo?.sol_user}
                  email={userInfo?.email}
                  className="rounded-full border-[3px] border-[#DD9000]"
                />
              </div>
            </motion.div>
          </div>
          <div
            className="text-white mt-[16px] text-shadow-[0px_0px_10px_rgba(255,213,105,0.50)] text-[24px] font-[DelaGothicOne]"
            style={{
              WebkitTextStroke: "1px #EEAF0F"
            }}
          >
            You are the Grand Winner
          </div>
          <div className="text-white text-[26px] font-[DelaGothicOne]">
            0xdolla
          </div>
          <div className="text-white text-[16px] font-[BlackHanSans] mt-[30px]">
            Also, you’ve got
          </div>
          {points > 0 && (
            <div className="flex items-center gap-[8px] mt-[10px]">
              <PointIcon size={60} />
              <span
                className="text-[#FFEF43] text-[36px] font-bold font-[AlfaSlabOne]"
                style={{
                  WebkitTextStrokeWidth: "1px",
                  WebkitTextStrokeColor: "#5E3737"
                }}
              >
                x{addThousandSeparator(points.toString())}
              </span>
            </div>
          )}
        </div>
        <Confetti />
      </div>
    </>
  );
}
