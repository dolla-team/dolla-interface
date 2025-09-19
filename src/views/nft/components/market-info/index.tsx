import { formatAddress } from "@/utils/format/address";
import { useNftContext } from "../../context";
import Avatar from "@/components/avatar";
import SellerLevel from "@/components/seller-level";
import { formatNumber } from "@/utils/format/number";
import { useNavigate } from "react-router-dom";
import { getAnchorPrice } from "@/utils/pool";

export default function MarketInfo() {
  const { pool, isDetail, getPoolRecommend } = useNftContext();
  const navigate = useNavigate();
  return (
    <div className="mb-[50px] w-[1016px] mx-auto">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-[32px]">
          <button
            className="button"
            onClick={() => {
              navigate("/nft-list");
            }}
          >
            <BackIcon />
          </button>
          <div className="flex items-center gap-[12px]">
            <div className="w-[39px] h-[39px] bg-linear-to-b from-[#FFC42F] to-[#99761C] rounded-[12px] p-[2px]">
              <Avatar
                size={35}
                address={pool?.user_info?.address}
                email={pool?.user_info?.email}
                className="rounded-[12px]"
              />
            </div>
            <div>
              <div>
                <span className="text-[16px] text-white">Seller</span>
              </div>
              <div className="flex items-center gap-[4px]">
                <span className="text-[14px] text-white">
                  {pool?.user ? formatAddress(pool.user) : "-"}
                </span>
                <SellerLevel />
              </div>
            </div>
          </div>
        </div>
        <button
          className="button flex items-center gap-[6px]"
          onClick={() => {
            if (isDetail) {
              navigate("/nft/detail");
            } else {
              getPoolRecommend();
            }
          }}
        >
          <RefreshIcon />
          <span className="text-[12px] text-[#8A87AA]">Randomly NFT</span>
        </button>
      </div>
      <div className="flex gap-[16px] mt-[10px]">
        {["Valued", "Players", "Bid", "You bid"].map((item) => (
          <div
            key={item}
            className="w-[242px] h-[72px] rounded-[16px] border border-[#483E62] bg-[#FFFFFF1A] backdrop-blur-[10px] flex flex-col justify-center items-center"
          >
            <div className="text-[14px] text-[#8A87AA]">{item}</div>
            <div className="text-[20px] text-white">
              {item === "Valued" && (
                <div
                  className="text-[20px] font-bold"
                  style={{
                    background:
                      "linear-gradient(90deg, #FFE9B2 0%, #FFC42F 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  {formatNumber(getAnchorPrice(pool?.anchor_price), 3, true, {
                    prefix: "$"
                  })}
                </div>
              )}
              {item === "Players" && <div>{pool?.participants}</div>}
              {item === "Bid" && (
                <div>
                  {formatNumber(pool?.accumulative_bids || 0, 3, true, {
                    prefix: "$"
                  })}
                </div>
              )}
              {item === "You bid" && (
                <div>
                  {formatNumber(pool?.user_draw_attempt?.times || 0, 3, true, {
                    prefix: "$"
                  })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const BackIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="18"
      viewBox="0 0 11 18"
      fill="none"
    >
      <path
        opacity="0.6"
        d="M9.5 1.5L2 9L9.5 16.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

const RefreshIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M8.08888 13.2888H8.66666C8.75555 13.2888 8.88888 13.2444 8.97777 13.2444C9.02221 13.2444 9.1111 13.1999 9.15555 13.1999C9.24443 13.1555 9.37777 13.1555 9.46666 13.111C9.5111 13.111 9.55555 13.0666 9.59999 13.0666C9.73332 13.0221 9.82221 12.9777 9.95555 12.9333C9.99999 12.9333 9.99999 12.8888 10.0444 12.8888C10.1778 12.8444 10.3111 12.7555 10.4444 12.711C10.8889 12.4888 11.2444 12.1777 11.6 11.8221C11.6889 11.7333 11.8222 11.5999 11.9111 11.4666C11.9111 11.4221 11.9555 11.4221 11.9555 11.3777C12.6667 10.4888 13.0667 9.3777 13.0667 8.1777H11.8667C11.8222 8.1777 11.8222 8.1777 11.7778 8.13325V8.04436L13.8667 4.9777C13.8667 4.93325 13.9111 4.93325 13.9555 4.93325C14 4.93325 14 4.93325 14.0444 4.9777L16 7.99992V8.08881C16 8.13325 15.9555 8.13325 15.9111 8.13325H14.7111C14.7111 9.55547 14.2667 10.8888 13.5111 11.9999C13.5111 11.9999 13.5111 12.0444 13.4667 12.0444C13.3778 12.1777 13.2889 12.2666 13.2 12.3555C13.1555 12.3999 13.1555 12.4444 13.1111 12.4888C12.9778 12.6221 12.8444 12.7999 12.7111 12.9333L12.6667 12.9777C12.2222 13.4221 11.6889 13.8221 11.1555 14.1333C11.1555 14.1333 11.1111 14.1333 11.1111 14.1777C10.9333 14.2666 10.8 14.3555 10.6222 14.3999C10.5778 14.3999 10.5333 14.4444 10.4889 14.4444C10.3555 14.4888 10.2222 14.5777 10.0444 14.6221C9.95554 14.6666 9.9111 14.6666 9.82221 14.711C9.68888 14.7555 9.55554 14.7999 9.42221 14.7999C9.33332 14.7999 9.24443 14.8444 9.15555 14.8444C9.1111 14.8444 9.06666 14.8444 9.06666 14.8888C8.93332 14.9333 8.79999 14.9333 8.7111 14.9333H8.57777C8.35555 14.9333 8.13332 14.9777 7.9111 14.9777C6.53332 14.9777 5.19999 14.5333 4.08888 13.7333C3.73332 13.4666 3.64443 12.9777 3.9111 12.5777C4.17777 12.2221 4.66666 12.1333 5.02221 12.3999C5.95554 12.9777 7.02221 13.3333 8.08888 13.2888ZM2.48888 4.31103C2.48888 4.31103 2.48888 4.26659 2.53332 4.26659C2.62221 4.13325 2.7111 3.99992 2.84443 3.86659L2.88888 3.82214C3.55554 2.9777 4.44443 2.35547 5.37777 1.91103C5.42221 1.91103 5.42221 1.86659 5.46666 1.86659C5.59999 1.82214 5.77777 1.73325 5.95554 1.68881C5.99999 1.68881 6.08888 1.64436 6.13332 1.64436C6.26666 1.59992 6.39999 1.55547 6.53332 1.55547C6.62221 1.55547 6.7111 1.51103 6.75554 1.51103C6.79999 1.51103 6.84443 1.51103 6.88888 1.46659C6.97777 1.46659 7.1111 1.42214 7.19999 1.42214C7.28888 1.42214 7.33332 1.42214 7.42221 1.3777C7.55554 1.3777 7.73332 1.33325 7.9111 1.33325H7.99999C9.37777 1.33325 10.7111 1.7777 11.8667 2.5777C12.2222 2.84436 12.3111 3.33325 12.0444 3.73325C11.7778 4.08881 11.2889 4.1777 10.9333 3.91103C10.0444 3.28881 9.02221 2.9777 7.95554 2.9777C7.82221 2.9777 7.64443 2.9777 7.5111 3.02214H7.37777C7.24443 3.02214 7.15554 3.06659 7.02221 3.06659C6.97777 3.06659 6.93332 3.11103 6.88888 3.11103C6.75554 3.15547 6.66666 3.15547 6.53332 3.19992C6.48888 3.19992 6.44443 3.24436 6.44443 3.24436L6.04443 3.3777H5.99999C5.24443 3.68881 4.57777 4.22214 4.08888 4.84436C3.37777 5.73325 2.93332 6.88881 2.93332 8.13325H4.13332C4.17777 8.13325 4.17777 8.13325 4.22221 8.1777V8.26658L2.22221 11.2888C2.22221 11.3333 2.17777 11.3333 2.13332 11.3333C2.08888 11.3333 2.08888 11.3333 2.04443 11.2888L0.0444336 8.26658V8.1777C0.0444336 8.13325 0.088878 8.13325 0.133322 8.13325H1.33332C1.28888 6.71103 1.73332 5.3777 2.48888 4.31103Z"
        fill="#8A87AA"
      />
    </svg>
  );
};
