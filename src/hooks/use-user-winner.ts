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
      const res = await axiosInstance.get("/api/v1/user/winning");
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
        if (
          item.token.toLocaleLowerCase() !==
            config.purchaseToken.address.toLocaleLowerCase() &&
          item.token.toLocaleLowerCase() !== TOKEN.address.toLocaleLowerCase()
        ) {
          _nfts.push({
            label: "NFT Prize",
            address: item.token,
            icon: item.icon,
            type: "nft",
            tokenId: item.token_id
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

  const coinItem = useMemo(() => {
    if (Number(coinBalance) <= 0) return null;
    return {
      label: "Bid Coins",
      address: config.purchaseToken.address,
      amount: coinBalance,
      type: "coin"
    };
  }, [coinBalance]);

  const [totalBtcAmount] = useMemo(() => {
    return [
      btcs.reduce((acc, item) => {
        return Big(acc).plus(
          Big(item.token_amount || 0).div(10 ** item.token_info?.decimals || 6)
        );
      }, 0)
    ];
  }, [btcs]);

  return {
    coinItem,
    nfts,
    loading,
    btcs,
    totalBtcAmount
  };
}
