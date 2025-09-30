import React, { useEffect, useState } from "react";

const LoadingScreen: React.FC = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Start animation after component mounts
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 100);

    const timer2 = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  return (
    show && (
      <div className="fixed inset-0 w-full h-full overflow-hidden z-[100]">
        {/* Bottom screen - 50% height */}
        <div
          className="absolute bottom-0 left-0 w-full h-[55%] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/btc/btc-loading-b.png)",
            transform: isAnimating ? "translateY(150%)" : "translateY(0)",
            transition: "transform 1.5s ease-in-out"
          }}
        />

        {/* Top screen - 50% height, positioned above bottom screen */}
        <div
          className="absolute top-0 left-0 w-full h-[55%] bg-cover bg-center bg-no-repeat z-10"
          style={{
            backgroundImage: "url(/btc/btc-loading-t.png)",
            transform: isAnimating ? "translateY(-150%)" : "translateY(0)",
            transition: "transform 1.5s ease-in-out"
          }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-[-90px] w-[188px] h-[188px] bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url(/btc/btc-loading-coin.png)"
            }}
          />
        </div>

        {/* Center coin icon */}
      </div>
    )
  );
};

export default LoadingScreen;
