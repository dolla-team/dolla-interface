import Button from "@/components/button";
import DollaEye from "@/components/dolla-eye";

export default function Banner() {
  return (
    <div className="w-full h-[300px] relative rounded-[20px] bg-[#000] mb-[12px] bg-[url('/home/banner-bg.png')] bg-cover bg-center pl-[40px] pt-[30px]">
      <div className="text-[20px] text-white font-[600]">Welcome to</div>
      <div className="text-[50px] text-white font-[700] mt-[-10px]">
        Dolla Market
      </div>
      <div className="text-[20px] text-white/30 font-[500] mt-[-10px]">
        Marketplace Reinvented
      </div>
      <Button className="w-[140px] h-[42px] mt-[80px]">How to play</Button>
      <DollaEye
        className="w-[74px] h-[74px] absolute bottom-[2px] right-[140px]"
        onlyEye
      />
    </div>
  );
}
