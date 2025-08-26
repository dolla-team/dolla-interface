import CarouselCoverflow from "@/components/carousel-coverflow";
import NftCard from "@/components/nft-card";
import { useNftContext } from "@/views/nft/context";

export default function Carousel() {
  const { carouselRef, pool } = useNftContext();

  return (
    <CarouselCoverflow
      className="w-full"
      initRotate={0}
      ref={carouselRef}
      isDrag={false}
      list={new Array(18).fill(0).map((_, index) => ({
        key: index,
        content:
          index === 0 ? (
            <NftCard data={pool} className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex flex-col rounded-[12px] bg-[#704CFF] p-[10px] bg-[url('/nft/default-bg.png')] bg-cover bg-center">
              <img
                className="rounded-[10px] w-full aspect-square object-cover shrink-0"
                src={`/nft/gifs/${index}.gif`}
              />
              <div className="grow flex flex-col justify-center items-center">
                <div className="text-[18px] text-white font-bold text-center">
                  DOLLA
                </div>
                <div className="text-[14px] text-white text-center mt-[6px]">
                  One dollar, one shot
                </div>
              </div>
            </div>
          )
      }))}
    />
  );
}
