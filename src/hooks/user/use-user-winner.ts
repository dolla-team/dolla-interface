import { useAuth } from "@/contexts/auth";
import axiosInstance from "@/libs/axios";
import { useEffect, useState, useMemo } from "react";
import Big from "big.js";
import { BASE_TOKEN } from "@/config/btc";
import useTokenPrice from "../use-token-price";

export default function useUserWinner() {
  const [nfts, setNfts] = useState<any[]>([]);
  const [btcs, setBtcs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuth();

  const tokenIds = useMemo(() => {
    return [
      {
        chain: "near",
        address: BASE_TOKEN?.address
      }
    ];
  }, [BASE_TOKEN]);

  const { prices } = useTokenPrice(tokenIds);

  const fetchNfts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/v1/user/winning?chain=near");
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
        if (item.token_info?.symbol === BASE_TOKEN.symbol) {
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
  }, [userInfo?.user]);

  const [totalAmount] = useMemo(() => {
    const _total = btcs
      .reduce((acc, item) => {
        return Big(acc).plus(Big(item.token_amount || 0));
      }, Big(0))
      .div(10 ** BASE_TOKEN.decimals);
    return [_total];
  }, [btcs]);

  const totalAmountWithPrice = useMemo(() => {
    return Big(totalAmount).times(prices?.[0]?.last_price || 0);
  }, [totalAmount, prices]);

  return {
    nfts,
    loading,
    btcs,
    totalAmount,
    totalAmountWithPrice
  };
}
