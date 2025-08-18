import EndPanel from "../../detail/end";
import Cancel from "../../detail/cancel";
import { useNftContext } from "../../context";
import clsx from "clsx";
import CarouselCoverflow from "@/components/carousel-coverflow";

export default function Laptop() {
  const { flipStatus, pool } = useNftContext();
  return (
    <div
      className={clsx(
        "relative flex items-center justify-center mx-auto overflow-hidde h-[calc(100vh-416px)] pt-[25px]",

        !(pool?.status === 1 || flipStatus !== 0)
          ? "w-[calc(100vw-220px)]"
          : "w-[calc(100vw-620px)]"
      )}
    >
      <CarouselCoverflow
        className="w-full"
        isDebug
        isDrag
        initRotate={-40}
        list={[
          {
            key: 1,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#CAB5FF_0%,_#6F37FF_100%)]">
                1
              </div>
            )
          },
          {
            key: 2,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#FFB5B5_0%,_#FF376F_100%)]">
                2
              </div>
            )
          },
          {
            key: 3,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#B5FFD9_0%,_#37FF6F_100%)]">
                3
              </div>
            )
          },
          {
            key: 4,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#B5E2FF_0%,_#377FFF_100%)]">
                4
              </div>
            )
          },
          {
            key: 5,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#FFF7B5_0%,_#FFD637_100%)]">
                5
              </div>
            )
          },
          {
            key: 6,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#B5FFF7_0%,_#37FFD6_100%)]">
                6
              </div>
            )
          },
          {
            key: 7,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#FFDEB5_0%,_#FFB637_100%)]">
                7
              </div>
            )
          },
          {
            key: 8,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#B5BFFF_0%,_#3737FF_100%)]">
                8
              </div>
            )
          },
          {
            key: 9,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#FFB5F7_0%,_#FF37D6_100%)]">
                9
              </div>
            )
          },
          {
            key: 10,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#B5FFB5_0%,_#37FF37_100%)]">
                10
              </div>
            )
          },
          {
            key: 11,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#FFD6B5_0%,_#FF9137_100%)]">
                11
              </div>
            )
          },
          {
            key: 12,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#B5F7FF_0%,_#37B6FF_100%)]">
                12
              </div>
            )
          },
          {
            key: 13,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#E2B5FF_0%,_#A637FF_100%)]">
                13
              </div>
            )
          },
          {
            key: 14,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#B5FFEC_0%,_#37FFC2_100%)]">
                14
              </div>
            )
          },
          {
            key: 15,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#FFB5C7_0%,_#FF378A_100%)]">
                15
              </div>
            )
          },
          {
            key: 16,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#B5FFD1_0%,_#37FF8A_100%)]">
                16
              </div>
            )
          },
          {
            key: 17,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#FFF0B5_0%,_#FFB637_100%)]">
                17
              </div>
            )
          },
          {
            key: 18,
            content: (
              <div className="w-full h-full flex justify-center items-center text-[32px] rounded-[12px] border border-[rgba(67,_67,_67,_0.80)] bg-[radial-gradient(126.53%_77.78%_at_50%_22.22%,_#B5D6FF_0%,_#377FFF_100%)]">
                18
              </div>
            )
          },
        ]}
      />
      {pool?.status === 2 && flipStatus === 0 && <EndPanel data={pool} />}
      {(pool?.status === 3 || pool?.status === 5) && flipStatus === 0 && (
        <Cancel data={pool} />
      )}
    </div>
  );
}
