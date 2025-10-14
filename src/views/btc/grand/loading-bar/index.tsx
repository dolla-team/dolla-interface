import { useEffect, useState } from "react";

export default function GrandLoading({ ended }: any) {
  const [width, setWidth] = useState(40);
  useEffect(() => {
    if (ended) {
      setWidth(100);
    }
  }, [ended]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(90);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full absolute left-0 top-0 z-[50] bg-black/50 flex items-center justify-center">
      <div>
        <span className="text-[#FFF] text-[14px] font-[600] text-left">
          Loading...
        </span>
        <div
          className="
          w-[315px] 
          h-[30px] 
          rounded-[6px] 
          bg-[#22242B] 
          shadow-[0px_-1px_0px_0px_#3D4049_inset,0px_2px_2px_0px_rgba(0,0,0,0.40)_inset]
          p-[5px]
        "
        >
          <div
            className="h-[20px] rounded-[4px] bg-[#FCBC51] relative duration-4000"
            style={{
              width: width + "%",
              backgroundImage:
                "linear-gradient(45deg, rgb(252,163,17) 25%, transparent 25%, transparent 50%,rgb(252,163,17) 50%, rgb(252,163,17) 75%,transparent 75%, transparent)"
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
