import { useAuth } from "@/contexts/auth";
import axiosInstance from "@/libs/axios";
import { useEffect, useState, useMemo } from "react";
import { TOKEN } from "@/config/btc";
import { PURCHASE_TOKEN } from "@/config";
import useTokenBalance from "@/hooks/use-token-balance";
import Big from "big.js";

export default function useUserWinner() {
  const [nfts, setNfts] = useState<any[]>([]);
  const [btcs, setBtcs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();
  // Mock token balance for NEAR integration
  const coinBalance = "0";

  const fetchNfts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/v1/user/winning");
      const _nfts: any = [];
      const _btcs: any = [];

      const _data = res.data.data || [];
      _data.forEach((item: any) => {
        // nfts
        if (
          item.token.toLocaleLowerCase() !==
          PURCHASE_TOKEN.address.toLocaleLowerCase() &&
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
      address: PURCHASE_TOKEN.address,
      amount: coinBalance,
      type: "coin"
    };
  }, [coinBalance]);

  const [totalBtcAmount] = useMemo(() => {
    return [
      btcs.reduce((acc, item) => {
        return Big(acc).plus(item.token_amount);
      }, 0)
    ];
  }, [btcs]);

  return {
    coinItem,
    nfts,
    loading,
    btcs,
    totalBtcAmount,
  };
}