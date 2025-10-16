import Button from "@/components/button";
import DollaEye from "@/components/dolla-eye";

export default function Banner() {
  return (
    <div className="w-full h-[300px] relative rounded-[20px] bg-[#000] bg-[url('/home/banner-btc-bg.png')] bg-cover bg-center pl-[40px] pt-[30px]">
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
      <DollaEye
        className="w-[74px] h-[74px] absolute bottom-[16px] right-[116px]"
        onlyEye
      />
    </div>
  );
}
