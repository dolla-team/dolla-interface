import { useAuth } from "@/contexts/auth";
import axiosInstance from "@/libs/axios";
import { useEffect, useState, useMemo } from "react";
import { TOKEN } from "@/config/btc";
import config from "@/config/bera";
import useTokenBalance from "./evm/use-token-balance";
import Big from "big.js";

export default function useUserWinner() {
  const [nfts, setNfts] = useState<any[]>([]);
  const [btcs, setBtcs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();
  // const { tokenBalance } = useTokenBalance(TOKEN);
  const { tokenBalance: coinBalance } = useTokenBalance(config.purchaseToken);

  const fetchNfts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        "/api/v1/user/winning?chain=Berachain"
      );
      const _nfts: any = [];
      const _btcs: any = [];

      // if (Number(tokenBalance) > 0) {
      //   _nfts.push({
      //     label: TOKEN.symbol,
      //     address: TOKEN.address,
      //     amount: tokenBalance,
      //     icon: TOKEN.icon,
      //     type: "coin"
      //   });
      // }
      const _data = res.data.data || [];
      _data.forEach((item: any) => {
        // nfts
        if (item.token_id) {
          _nfts.push({
            label: "NFT Prize",
            address: item.token,
            icon: item.token_info.icon,
            type: "nft",
            tokenId: item.token_id,
            value: item.token_usd
          });
        }
        // btc
        if (item.token_info?.symbol === "BTC") {
          _btcs.push(item);
        }
      });

      setNfts(_nfts);
      setBtcs(_btcs);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.user) {
      fetchNfts();
    }
  }, [userInfo]);

  const [totalAmount] = useMemo(() => {
    return [
      nfts.reduce((acc, item) => {
        return Big(acc).plus(Big(item.value || 0));
      }, 0)
    ];
  }, [nfts]);

  return {
    nfts,
    loading,
    btcs,
    totalAmount
  };
}
