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
            `/api/v1/bid/list?${x.toString()}`,
        )

        console.log('signedData:', signedData);
    }, [])

    return { data, loading };
}