import BannerCoin from "./banner-coin";
import { useNavigate } from "@/libs/router";

export default function Banner() {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[300px] relative rounded-[20px] bg-[#000]">
      <div className="relative w-full h-full flex flex-col justify-end items-center pb-[20px]">
        <BannerCoin />
        <div className="text-[42px] text-white font-[700] mt-[-10px]">
          Dolla Market
        </div>
        <div className="w-[312px] text-center mt-[8px]">
          <span className="text-[18px] text-white">The first</span>{" "}
          <span className="text-[18px] text-[#FFC42F] font-[600]">
            Trustless Probabilistic Marketplace
          </span>
        </div>
        <div className="text-[14px] text-white mt-[20px] flex gap-[20px]">
          <span>· $1 Accessibility</span>
          <span>· Verifiable Probability</span>
        </div>
      </div>
      <div className="absolute left-[16px] bottom-[0px] cursor-pointer group">
        <div className="absolute left-0 bottom-0 w-[340px] h-[240px] bg-[url('/home/banner-bidder-gray.png')] bg-cover bg-center opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute left-[-40px] bottom-0 z-[2] w-[373px] h-[260px] bg-[url('/home/banner-bidder.png')] bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute left-[-60px] bottom-[160px] z-[1] w-[209px] h-[169px] bg-[url('/home/banner-bidder-text.png')] bg-cover bg-center opacity-0 group-hover:opacity-100 translate-y-[50px] group-hover:translate-y-0 transition-transform duration-300"></div>
        <div
          onClick={() => {
            navigate("/btc/detail");
          }}
          className="absolute left-[102px] bottom-[16px] z-[3] w-[152px] h-[40px] bg-linear-to-b from-[#37EFA8] to-[#5BF5BA] flex items-center justify-center rounded-[12px] text-[14px] text-[#2B3337] font-[600] group-hover:animate-[pulse-scale_1s_ease-in-out_infinite]"
        >
          Bid
          <div className="w-full h-full rounded-[12px] bg-black/30 absolute left-0 top-0 opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
        </div>
      </div>
      <div className="absolute right-[40px] bottom-[0px] cursor-pointer group">
        <div className="absolute right-[-10px] bottom-0 w-[346px] h-[248px] bg-[url('/home/banner-seller-gray.png')] bg-cover bg-center opacity-100 group-hover:opacity-0 transition-opacity duration-300"></div>
        <div className="absolute right-[-10px] bottom-[-30px] z-[2] w-[358px] h-[306px] bg-[url('/home/banner-seller.png')] bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute right-[-84px] bottom-[140px] z-[1] w-[214px] h-[188px] bg-[url('/home/banner-seller-text.png')] bg-cover bg-center opacity-0 group-hover:opacity-100 translate-y-[50px] group-hover:translate-y-0 transition-transform duration-300"></div>
        <div
          onClick={() => {
            navigate("/btc/create");
          }}
          className="absolute right-[60px] bottom-[16px] z-[3] w-[152px] h-[40px] bg-linear-to-b from-[#FFB700] to-[#FFCE54] flex items-center justify-center rounded-[12px] text-[14px] text-[#2B3337] font-[600] group-hover:animate-[pulse-scale_1s_ease-in-out_infinite]"
        >
          Sell
          <div className="w-full h-full rounded-[12px] bg-black/30 absolute left-0 top-0 opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
        </div>
      </div>
    </div>
  );
}
