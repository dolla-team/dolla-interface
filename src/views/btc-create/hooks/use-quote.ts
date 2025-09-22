import { useRequest } from "ahooks";
import useDeposit from "@/hooks/near/use-deposit";
import { useAuth } from "@/contexts/auth";
import { BASE_TOKEN } from "@/config/btc";
import Big from "big.js";

export default function useQuote(amount: number) {
  const { generateDepositAddress, loading } = useDeposit();
  const { address } = useAuth();
  const { data: depositAddress } = useRequest(
    async () => {
      if (!amount) return;
      const response = await generateDepositAddress({
        amount: Big(amount)
          .mul(10 ** BASE_TOKEN.decimals)
          .toFixed(0),
        evmAddress: address,
        originAsset: BASE_TOKEN.createOriginAssetId,
        destinationAsset: BASE_TOKEN.destinationAssetId,
        // TODO
        refundTo: address
      });

      return response;
    },
    {
      refreshDeps: [amount, address]
    }
  );

  return {
    depositAddress,
    loading,
    token: {
      symbol: BASE_TOKEN.createTokenName,
      icon: BASE_TOKEN.createTokenIcon,
      chainName: BASE_TOKEN.createChainName,
      chainLogo: BASE_TOKEN.createChainLogo,
      address: BASE_TOKEN.address,
      decimals: BASE_TOKEN.decimals
    }
  };
}
