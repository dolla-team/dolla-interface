import { useAuth } from "@/contexts/auth";
import { formatNumber } from "@/utils/format/number";
import Big from "big.js";
import { BASE_TOKEN, QUOTE_TOKEN } from "@/config/btc";
import useTokenPrice from "@/hooks/use-token-price";
import { useMemo } from "react";

export default function Tokens() {
  const { nearAccount } = useAuth() || {};

  const tokenIds = useMemo(() => {
    return [
      {
        chain: "near",
        address: QUOTE_TOKEN?.address
      },
      {
        chain: "near",
        address: BASE_TOKEN?.address
      }
    ];
  }, [QUOTE_TOKEN, BASE_TOKEN]);

  const { prices } = useTokenPrice(tokenIds);

  return (
    <div>
      <Item
        balance={nearAccount?.balance}
        price={prices[0]?.last_price || 1}
        token={QUOTE_TOKEN}
      />
      <Item
        balance={nearAccount?.prizeBalance}
        price={prices[1]?.last_price || 1}
        token={BASE_TOKEN}
      />
    </div>
  );
}

const Item = ({
  balance,
  price,
  token
}: {
  balance: string;
  price: number;
  token: any;
}) => {
  return (
    <div className="flex justify-between items-center mb-[10px]">
      <div className="flex items-center gap-[14px]">
        <div className="w-[32px] h-[32px] rounded-full relative">
          <img src={token.icon} className="w-full h-full object-cover" />
          {/* <img
            src="/chains/bera-1.png"
            className="w-[16px] h-[16px] absolute bottom-[-4px] right-[-4px]"
          /> */}
        </div>
        <div>
          <div>
            <span className="text-[14px] text-black">{token.symbol} </span>
            {/* <span className="text-[12px] text-[#8A87AA]">(Near)</span> */}
          </div>
          <div className="text-[12px] text-[#8A87AA]">
            ${formatNumber(price, 2, true)}
          </div>
        </div>
      </div>
      <div>
        <div className="text-[14px] text-black">
          {formatNumber(balance || 0, 2, true)}
        </div>
        <div className="text-[12px] text-[#8A87AA]">
          $
          {formatNumber(
            Big(balance || 0)
              .mul(price)
              .toNumber(),
            2,
            true
          )}
        </div>
      </div>
    </div>
  );
};
