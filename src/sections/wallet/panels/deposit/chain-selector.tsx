import clsx from "clsx";
import { chainConfig } from "../../chain-config";
import { useChains } from "../../use-chains";

export default function ChainSelector({
  selectedChain,
  onSelect,
  className
}: any) {
  const usedChains = useChains();

  return (
    <div>
      <div
        className={clsx("flex flex-col gap-[8px] overflow-y-auto", className)}
      >
        {usedChains.map((network) => (
          <div
            key={network.blockchain}
            onClick={() => {
              onSelect({
                ...network,
                name:
                  chainConfig[network?.blockchain]?.name || network.blockchain
              });
            }}
            className={clsx(
              "flex items-center gap-[10px] bg-[#00000008] border border-transparent p-[6px] h-[46px] rounded-[10px] cursor-pointer",
              selectedChain?.blockchain === network.blockchain
                ? "bg-[#FFC42F33] !border-[#FFC42F]"
                : "hover:bg-[#FFC42F33] hover:border-[#FFC42F]"
            )}
          >
            <div className="w-[30px] h-[30px] flex items-center justify-center">
              <img
                src={chainConfig[network?.blockchain]?.icon}
                alt={
                  chainConfig[network?.blockchain]?.name || network.blockchain
                }
                className="w-full h-full object-cover rounded-[6px]"
              />
            </div>
            <div className="text-[14px] font-[400] text-black">
              {chainConfig[network?.blockchain]?.name || network.blockchain}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
