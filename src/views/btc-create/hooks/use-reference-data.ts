import { useAuth } from "@/contexts/auth";
import { useRequest } from "ahooks";
import axiosInstance from "@/libs/axios";
import Big from "big.js";
import { useMemo } from "react";

export function useReferenceData(props: any) {
  const { token, amount } = props;

  const { userInfo } = useAuth();

  const { data: referenceList, loading: referenceListLoading } = useRequest(
    async () => {
      if (!userInfo?.user || !token) return [];
      try {
        const response = await axiosInstance.get(
          "/api/v1/pool/create/reference"
        );
        if (
          response.status !== 200 ||
          response.data.code !== 0 ||
          !response.data.data
        ) {
          return [];
        }
        return response.data.data;
      } catch (err: any) {
        console.log("get reference list failed: %o", err);
      }
    },
    {
      refreshDeps: [userInfo?.user]
    }
  );

  const [data] = useMemo(() => {
    if (!referenceList || !token) return [];
    const _data = referenceList.find((item: any) => {
      return (
        item.reward_token.toLowerCase() === token.address.toLowerCase() &&
        Big(item.reward_amount || 0)
          .div(10 ** token.decimals)
          .eq(amount || 0)
      );
    });
    return [_data];
  }, [referenceList, token, amount]);

  return {
    data,
    loading: referenceListLoading
  };
}
