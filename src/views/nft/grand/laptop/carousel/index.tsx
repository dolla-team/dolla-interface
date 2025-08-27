import CarouselCoverflow from "@/components/carousel-coverflow";
import NftCard from "@/components/nft-card";
import { useNftContext } from "@/views/nft/context";
import { useMemo } from "react";

export default function Carousel() {
  const { carouselRef, pool, bids } = useNftContext();

  const extraNumber = useMemo(() => {
    if (bids === 1) {
      return 1;
    }
    if (bids === 5) {
      return 2;
    }
    if (bids === 10) {
      return 3;
    }
    if (bids === 20) {
      return 4;
    }
    return 0;
  }, [bids]);

  return (
    <CarouselCoverflow
      className="w-[1016px]"
      initRotate={-30}
      ref={carouselRef}
      isDrag={false}
      list={new Array(18).fill(0).map((_, index) => ({
        key: index,
        content:
          index < extraNumber ? (
            <NftCard data={pool} className="w-full h-full" isSimple />
          ) : (
            <div className="w-full h-full flex flex-col rounded-[12px] bg-[#704CFF] p-[10px] bg-[url('/nft/carousel-item.png')] bg-cover bg-center"></div>
          )
      }))}
    />
  );
}
