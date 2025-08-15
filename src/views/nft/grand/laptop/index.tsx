import CarouselCoverflow from "@/components/carousel-coverflow";

export default function Laptop() {
  return (
    <div className="w-full">
      <CarouselCoverflow
        className="w-full"
        list={[
          {
            key: 1,
            content: (
              // Note: The width here needs to be set to 100%, otherwise there will be display issues due to the width limitation of swiper's slidesPerView.
              <div className="w-full h-[446px] flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#CAB5FF_0%,_#6F37FF_100%)]">
                1
              </div>
            )
          },
          {
            key: 2,
            content: (
              <div className="w-full h-[446px] flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#FFB5B5_0%,_#FF376F_100%)]">
                2
              </div>
            )
          },
          {
            key: 3,
            content: (
              <div className="w-full h-[446px] flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#B5FFD9_0%,_#37FF6F_100%)]">
                3
              </div>
            )
          },
          {
            key: 4,
            content: (
              <div className="w-full h-[446px] flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#B5E2FF_0%,_#377FFF_100%)]">
                4
              </div>
            )
          },
          {
            key: 5,
            content: (
              <div className="w-full h-[446px] flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#FFF7B5_0%,_#FFD637_100%)]">
                5
              </div>
            )
          },
          {
            key: 6,
            content: (
              <div className="w-full h-[446px] flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#B5FFF7_0%,_#37FFD6_100%)]">
                6
              </div>
            )
          },
          {
            key: 7,
            content: (
              <div className="w-full h-[446px] flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#FFDEB5_0%,_#FFB637_100%)]">
                7
              </div>
            )
          }
        ]}
      />
    </div>
  );
}
