import { useAuth } from "@/contexts/auth";
import { useRequest } from "ahooks";
import axiosInstance from "@/libs/axios";
import { useMemo } from "react";
import Big from "big.js";
import { AMOUNT } from "@/config/btc";

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

  const [data, bids] = useMemo(() => {
    if (!referenceList || !token) return [null, []];

    let _data: any = {};

    let _bids: any = {
      [AMOUNT[0]]: {
        label: AMOUNT[0],
        value: 0,
        percentage: 0
      },
      [AMOUNT[1]]: {
        label: AMOUNT[1],
        value: 0,
        percentage: 0
      },
      [AMOUNT[2]]: {
        label: AMOUNT[2],
        value: 0,
        percentage: 0
      }
    };

    let _totalCreations = Big(0);

    referenceList.forEach((item: any) => {
      const _label = Big(item.reward_amount)
        .div(10 ** token.decimals)
        .toString();
      const _timing = [
        {
          label: "in 1 day",
          value: item.end_time_1day_num,
          percentage: Number(item.end_time_1day * 100).toFixed(2)
        },
        {
          label: "in 2 days",
          value: item.end_time_2day_num,
          percentage: Number(item.end_time_2day * 100).toFixed(2)
        },
        {
          label: "in 7 days",
          value: item.end_time_7day_num,
          percentage: Number(item.end_time_7day * 100).toFixed(2)
        },
        {
          label: "other days",
          value: item.end_time_other_day_num,
          percentage: Number(item.end_time_other_day * 100).toFixed(2)
        }
      ];

      if (_bids[_label]) {
        _totalCreations = _totalCreations.plus(item.total_creations_amount);

        _bids[_label] = {
          label: _label,
          value: item.total_creations_amount,
          percentage: 0
        };
      }

      _data[_label] = {
        top_sale: item.top_sale,
        avg_profit: item.avg_profit,
        live: item.live,
        timing: _timing
      };
    });

    const _bidsList = Object.values(_bids).map((item: any) => {
      item.percentage = Number(
        (item.value / _totalCreations.toNumber()) * 100
      ).toFixed(2);
      item.label = String(item.label);
      return item;
    });

    return [_data, _bidsList];
  }, [referenceList, token]);

  const currentData = useMemo(() => {
    if (!data) return {};
    return data[amount];
  }, [data, amount]);

  return {
    data: currentData,
    loading: referenceListLoading,
    bidsMarket: bids
  };
}
