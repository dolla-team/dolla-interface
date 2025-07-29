import axiosInstance from "@/libs/axios";
import { useCallback, useEffect, useState } from "react";

const LIMIT = 10;
export default function useProvably() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        getProvablyData({
            limit: LIMIT,
            offset: offset
        });
    }, [offset]);

    const getProvablyData = useCallback(async (query: any) => {
        const x = new URLSearchParams(query)

        const signedData = await axiosInstance.get(
            `/api/v1/pool/ended_market?${x.toString()}`,
        )

        console.log('signedData:', signedData);
    }, [])

    const verifySolana = useCallback(async (query: any) => {
        const signedData = await axiosInstance.post(
            `/api/v1/verify/sol`,
            {
                'settle_hash': query.settle_hash,
                'id': query.id,
            }
        )

        console.log('signedData:', signedData);
    }, [])

    return { data, loading, verifySolana };
}