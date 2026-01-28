import BannerCoin from "./banner-coin";
import { useNavigate } from "@/libs/router";
import useDocsStore from "@/stores/use-docs";

export default function Banner() {
  const navigate = useNavigate();
  const { set } = useDocsStore();
  return (
    <div className="w-full h-[300px] relative rounded-[20px] bg-[#000]">
      <div className="flex">
        <div className="relative w-[430px] h-full pt-[30px] pl-[35px]">
          <div className="text-[36px] text-white font-[700] w-[384px] leading-[120%]">
            One Dolla $1 Infinite Exposure
          </div>
          <div className="text-[16px] text-white/60 leading-[130%] w-[350px] pt-[10px]">
            Get exposute to bluchip assets that usually feel out of reach
          </div>
          <div
            className="flex items-center gap-[6px] button mt-[80px]"
            onClick={() => {
              set({ showModal: true });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M6.43945 0.15332C7.99124 -0.155302 9.59978 0.00390161 11.0615 0.609375C12.5232 1.21488 13.7723 2.24014 14.6514 3.55566C15.5304 4.87125 16 6.41775 16 8C16 10.1217 15.1575 12.1569 13.6572 13.6572C12.1569 15.1575 10.1217 16 8 16C6.41775 16 4.87125 15.5304 3.55566 14.6514C2.24014 13.7723 1.21488 12.5232 0.609375 11.0615C0.00390161 9.59978 -0.155302 7.99124 0.15332 6.43945C0.462003 4.8876 1.22395 3.4616 2.34277 2.34277C3.4616 1.22395 4.8876 0.462003 6.43945 0.15332ZM8 1C6.61563 1 5.26242 1.41062 4.11133 2.17969C2.9602 2.94884 2.06302 4.04224 1.5332 5.32129C1.00344 6.60026 0.864765 8.00748 1.13477 9.36523C1.40486 10.7231 2.07085 11.9712 3.0498 12.9502C4.02877 13.9292 5.2769 14.5951 6.63477 14.8652C7.99254 15.1353 9.39972 14.9966 10.6787 14.4668C11.9578 13.937 13.0512 13.0398 13.8203 11.8887C14.5894 10.7376 15 9.38438 15 8C15 6.14349 14.2629 4.36256 12.9502 3.0498C11.6374 1.73706 9.85651 1 8 1ZM7.92578 10.6699C8.03808 10.6641 8.15024 10.6811 8.25586 10.7197C8.36154 10.7584 8.45896 10.8175 8.54102 10.8945C8.6239 10.971 8.6891 11.0654 8.73145 11.1699C8.77369 11.2744 8.79244 11.3875 8.78613 11.5C8.78853 11.612 8.76763 11.7233 8.72559 11.8271C8.68348 11.9311 8.6208 12.0256 8.54102 12.1045C8.37102 12.2576 8.14965 12.3418 7.9209 12.3398C7.69847 12.3373 7.48589 12.2476 7.32812 12.0908C7.17046 11.9341 7.08018 11.7223 7.07617 11.5C7.07118 11.388 7.09159 11.2759 7.13574 11.1729C7.17989 11.0699 7.24659 10.9779 7.33105 10.9043C7.40794 10.8254 7.50106 10.7641 7.60352 10.7236C7.70601 10.6832 7.81571 10.6648 7.92578 10.6699ZM8.10547 3.85938C8.7744 3.81745 9.43486 4.03259 9.95117 4.45996C10.1807 4.67011 10.3613 4.92832 10.4805 5.21582C10.5996 5.50342 10.6543 5.814 10.6406 6.125C10.6584 6.63273 10.5074 7.13238 10.2109 7.54492C9.8961 7.86771 9.5619 8.17101 9.21094 8.4541C9.00768 8.61856 8.83794 8.82126 8.71094 9.0498C8.58379 9.28957 8.51951 9.55778 8.52539 9.8291V10.0293H7.30566V9.8291C7.29242 9.44892 7.36751 9.07071 7.52539 8.72461C7.8914 8.17717 8.3402 7.68936 8.85547 7.2793L9.05566 7.05957C9.25364 6.8201 9.3651 6.52061 9.37109 6.20996C9.38718 5.85957 9.26503 5.51636 9.03125 5.25488C8.89765 5.13093 8.73939 5.03581 8.56738 4.97559C8.39546 4.91541 8.2129 4.89078 8.03125 4.9043C7.81381 4.88523 7.59457 4.92144 7.39453 5.00879C7.19459 5.09612 7.01952 5.23193 6.88574 5.4043C6.65424 5.75993 6.54431 6.18101 6.57129 6.60449H5.36035C5.34123 6.23793 5.39824 5.87132 5.52637 5.52734C5.65448 5.18345 5.85126 4.86917 6.10547 4.60449C6.37088 4.35116 6.68547 4.15444 7.0293 4.02637C7.37299 3.89835 7.73915 3.84148 8.10547 3.85938Z"
                fill="white"
              />
            </svg>
            <span className="text-[14px] text-white">How it works?</span>
          </div>
        </div>
        <div className="text-[36px] font-[700] leading-[120%] pt-[32px]">
          <div className="text-[#FFB700]/30">GOLD</div>
          <div className="text-[#FFC42F]">BTC</div>
          <div className="text-[#7BFF7B]/30">RWAS</div>
          <div className="text-[#C57EFF]/20">NFTs</div>
        </div>
      </div>
      <div className="absolute right-[500px] bottom-[0px] group">
        <BannerCoin />
        <div className="absolute left-0 bottom-0 w-[262px] h-[182px] bg-[url('/home/banner-bidder-gray.png')] bg-cover bg-center opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute left-[-30px] bottom-0 z-[2] w-[353px] h-[246px] bg-[url('/home/banner-bidder.png')] bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div
          onClick={() => {
            navigate("/btc");
          }}
          className="cursor-pointer absolute left-[80px] bottom-[16px] z-[3] w-[152px] h-[40px] bg-[#D9D9D9] group-hover:bg-[#FFC42F] group-hover:shadow-[0px_0px_10px_0px_#FFC42F] flex items-center justify-center rounded-[12px] text-[14px] text-[#2B3337] font-[600] group-hover:animate-[pulse-scale_1s_ease-in-out_infinite]"
        >
          Get Exposure
        </div>
      </div>
      <div className="absolute right-[0px] bottom-[0px] group">
        <div className="absolute right-[0px] bottom-0 w-[273px] h-[300px] bg-[url('/home/banner-seller-gray.png')] bg-cover bg-center opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute right-[0px] bottom-[0px] z-[2] w-[355px] h-[300px] bg-[url('/home/banner-seller.png')] bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div
          onClick={() => {
            navigate("/btc/create");
          }}
          className="cursor-pointer absolute right-[60px] bottom-[16px] z-[3] w-[152px] h-[40px] bg-[#D9D9D9] group-hover:bg-[#00FF95] group-hover:shadow-[0px_0px_10px_0px_#00FF95] flex items-center justify-center rounded-[12px] text-[14px] text-[#2B3337] font-[600] group-hover:animate-[pulse-scale_1s_ease-in-out_infinite]"
        >
          List
        </div>
      </div>
    </div>
  );
}
