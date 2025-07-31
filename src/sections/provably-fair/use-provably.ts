import axiosInstance from "@/libs/axios";
import { formatAddress } from "@/utils/format/address";
import { useDebounceFn, useThrottle, useThrottleFn } from "ahooks";
import { useCallback, useEffect, useState } from "react";

const LIMIT = 10;
export default function useProvably() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0)
    const [youParticipateOnly, setYouParticipateOnly] = useState(false)
    const [hasNext, setHasNext] = useState(false)
    const [poolId, setPoolId] = useState('')

    useEffect(() => {
        getProvablyDataThrottled()
    }, [offset, youParticipateOnly, poolId]);

    const getProvablyData = useCallback(async (query: any) => {
        try {
            setLoading(true)
            const queryString = new URLSearchParams(query).toString()
            const provablyData = await axiosInstance.get(
                `/api/v1/pool/ended_market?${queryString}`,
            )

            if (provablyData.data?.data?.list?.length > 0) {
                const list = provablyData.data?.data?.list.map((item: any) => {
                    const winNumber = item.winner_info?.verify_result?.win_number

                    return {
                        // ...item,
                        marketId: item.pool_id,
                        marketSize: item.reward_token_info ? (item.reward_amount / (10 ** item.reward_token_info[0]?.decimals)) + ' ' + item.reward_token_info[0]?.symbol : 0,
                        winNo: winNumber ? `0-${winNumber}` : '',
                        settleTX: winNumber ? formatAddress(item.winner_info?.verify_result?.settle_tx_hash) : '',
                        winner: item.winner_user ? formatAddress(item.winner_user) : '',
                        userDrawAttempt: !!item.user_draw_attempt,
                    }
                })
                setHasNext(provablyData.data?.data.has_next_page)
                setData(list)
            } else {
                setHasNext(provablyData.data?.data.has_next_page)
                setData([])
            }
        } catch (error) {
            console.log('error:', error);
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        setOffset(0)
    }, [youParticipateOnly])

    const { run: getProvablyDataThrottled } = useDebounceFn(() => {

        const params: any = {
            limit: LIMIT,
            offset,
        }
        if (poolId) {
            params.pool_id = poolId
        } else {
            params.you_participate_only = youParticipateOnly
        }

        getProvablyData(params);
    }, { wait: 500 })


    const verifySolana = useCallback(async (value: string) => {
        if (!value) {
            return;
        }

        try {
            const params: any = {}

            if (value.length > 20) {
                params.settle_hash = value
            } else {
                params.id = Number(value)
            }

            const signedData = await axiosInstance.post(
                `/api/v1/verify/sol`,
                params
            )

            return signedData.data?.data
        } catch (error) {
            console.log('error:', error);
        }

        return null

    }, [])

    return {
        data, 
        loading, 
        hasNext, 
        verifySolana, 
        setYouParticipateOnly, 
        youParticipateOnly, 
        offset: offset / LIMIT, 
        setOffset: (pageNo: number) => {
            setOffset(pageNo * LIMIT)
        }, 
        setPoolId, 
        poolId
    };
}