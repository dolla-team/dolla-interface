import clsx from "clsx";
import NFTCard from "./nft-card";
import NFTEmptyCard from "./nft-empty-card";
import { useEffect, useState } from "react";

export default function Nfts({ nfts, onSelectNft, currentNft }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (nfts[currentIndex]) onSelectNft(nfts[currentIndex]);
  }, [currentIndex, nfts]);

  return (
    <div className="w-full h-[300px] relative">
      <div className="w-full h-full overflow-hidden flex items-center">
        <div
          className="flex justify-center items-center gap-[16px] duration-500"
          style={{
            transform: `translateX(-${
              currentIndex < 2 ? 0 : (currentIndex - 2) * 144
            }px)`
          }}
        >
          {nfts.map((item: any, index: number) => (
            <NFTCard
              key={item.token.tokenId + item.token.contract}
              data={item}
              checked={item.token.tokenId === currentNft?.id}
              onSelect={() => {
                setCurrentIndex(index);
              }}
            />
          ))}
          {nfts.length === 0 &&
            Array.from({ length: 6 }).map((_, index) => (
              <NFTEmptyCard key={index} />
            ))}
        </div>
      </div>
      {nfts.length > 0 && (
        <>
          <ArrowBtn
            className="absolute left-[-40px] top-[50%] translate-y-[-50%]"
            isLeft
            onClick={() => {
              setCurrentIndex((prev) => prev - 1);
            }}
            disabled={currentIndex === 0}
          />
          <ArrowBtn
            className="absolute right-[-40px] top-[50%] translate-y-[-50%]"
            onClick={() => {
              setCurrentIndex((prev) => prev + 1);
            }}
            disabled={currentIndex === nfts.length - 1}
          />
        </>
      )}
    </div>
  );
}

const ArrowBtn = ({
  className,
  isLeft,
  onClick,
  disabled
}: {
  className: string;
  isLeft?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  return (
    <button
      className={clsx(
        "w-[39px] h-[39px] rounded-[10px] border border-[#373737] bg-[#141519] button flex items-center justify-center",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="9"
        height="14"
        viewBox="0 0 9 14"
        fill="none"
        className={clsx(isLeft && "rotate-180")}
      >
        <path
          d="M1.5 1L7.5 7L1.5 13"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
};
