import Button from "@/components/button";
import BannerCoin from "./banner-coin";

export default function Banner() {
  return (
    <div className="w-full h-[300px] relative rounded-[20px] bg-[#000] pl-[40px] pt-[30px]">
      <BannerCoin />
      <div className="bg-[url('/home/bg-coins.png')] bg-cover bg-center absolute w-[360px] h-[158px] bottom-[0] right-[432px]" />
      <div className="bg-[url('/home/banner-woman.png')] bg-cover bg-center absolute w-[446px] h-[311px] bottom-[0] right-[0]" />
      <div className="relative z-[2]">
        <div className="text-[50px] text-white font-[700] mt-[-10px]">
          Dolla Market
        </div>
        <div className="w-[480px] text-[20px] text-white/60 mt-[-4px]">
          Turn every stablecoin into a fair shot at owning something bigger.
        </div>
        <Button
          onClick={() => {
            window.open(window.location.origin + "/docs", "_blank");
          }}
          className="w-[140px] h-[42px] mt-[80px] !bg-[#FFC42F]"
        >
          How it works
        </Button>
      </div>
    </div>
  );
}
