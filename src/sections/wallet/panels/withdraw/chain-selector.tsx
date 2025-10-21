import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { chainConfig } from "../../chain-config";
import { useChains } from "../../use-chains";

interface ChainSelectorProps {
  selectedChain: any;
  onSelect: (chain: any) => void;
  className?: string;
}

export default function ChainSelector({
  selectedChain,
  onSelect,
  className
}: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const usedChains = useChains();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChainSelect = (chain: any) => {
    onSelect({
      ...chain,
      name: chainConfig[chain?.blockchain]?.name || chain.blockchain
    });
    setIsOpen(false);
  };

  return (
    <div className={clsx("relative", className)} ref={dropdownRef}>
      {/* Dropdown trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "w-full h-[40px] rounded-[10px] border border-[#8A87AA4D] bg-white",
          "flex items-center justify-between px-[12px] text-[12px]",
          "hover:border-[#FFC42F] transition-colors duration-200"
        )}
      >
        <div className="flex items-center gap-[8px]">
          {selectedChain && (
            <img
              src={chainConfig[selectedChain?.blockchain]?.icon}
              alt={selectedChain?.name}
              className="w-[20px] h-[20px] object-cover rounded-[4px]"
            />
          )}
          <span
            className={clsx(
              "text-left",
              selectedChain ? "text-black" : "text-[#8A87AA]"
            )}
          >
            {selectedChain?.name || "Select Network"}
          </span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="10"
          viewBox="0 0 13 10"
          fill="none"
          className={clsx(
            "transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        >
          <path
            d="M5.62161 9.33204C6.01977 9.89997 6.86109 9.89997 7.25925 9.33204L12.6981 1.57405C13.1627 0.911339 12.6887 0 11.8793 0H1.00155C0.192199 0 -0.281877 0.911337 0.182729 1.57405L5.62161 9.33204Z"
            fill="#8A87AA"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-[4px] py-[10px] bg-white border border-[#D9D9D9] rounded-[10px] shadow-lg z-[110]">
          {usedChains.map((chain) => (
            <button
              key={chain.blockchain}
              onClick={() => handleChainSelect(chain)}
              className={clsx(
                "w-full flex items-center gap-[10px] p-[12px] h-[50px] text-left",
                "hover:bg-black/5 duration-200"
              )}
            >
              <img
                src={chainConfig[chain?.blockchain]?.icon}
                alt={chainConfig[chain?.blockchain]?.name || chain.blockchain}
                className="w-[20px] h-[20px] object-cover rounded-[4px]"
              />
              <span className="text-[12px] text-black">
                {chainConfig[chain?.blockchain]?.name || chain.blockchain}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
