import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import clsx from "clsx";
import { forwardRef, useImperativeHandle, useRef } from "react";
import type { SwiperRef } from "swiper/react";

const CarouselCoverflow = (props: any, ref: any) => {
  const { className, swiperClassName, list } = props;

  const swiperRef = useRef<SwiperRef>(null);

  useImperativeHandle(ref, () => ({
    // Expose swiper core methods
    swiper: swiperRef.current,
  }));

  return (
    <div className={clsx("w-full relative", className)}>
      <Swiper
        ref={swiperRef}
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        // Initialize centered to avoid blank space on the left
        // the value is slidesPerView / 2
        initialSlide={2}
        slidesPerView={5}
        spaceBetween={40}
        loop={false}
        coverflowEffect={{
          // Slide rotate in degrees
          rotate: -15,
          // Stretch space between slides
          stretch: 0,
          // Depth offset in px (slides translate in Z axis)
          depth: 100,
          // Effect multiplier
          modifier: 0.3,
          // Enables slides shadows
          slideShadows: false,
          // Slide scale effect
          scale: 0.95,
        }}
        pagination={false}
        modules={[EffectCoverflow, Pagination]}
        className={clsx("w-full", swiperClassName)}
      >
        {
          list?.map((item: any, index: number) => (
            <SwiperSlide key={index}>
              {item.content}
            </SwiperSlide>
          ))
        }
      </Swiper>
      <img
        src="/nfts/carousel-arrow.png"
        alt=""
        className="w-[52px] h-[69px] shrink-0 absolute z-[1] left-1/2 -translate-x-1/2 top-[-27px]"
      />
    </div>
  );
};

export default forwardRef(CarouselCoverflow);
