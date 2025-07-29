import axiosInstance from "@/libs/axios";
import { useState, useRef } from "react";
import useIsMobile from "@/hooks/use-is-mobile";

export default function useHistory() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(0);
  const isMobile = useIsMobile();
  const pageSize = isMobile ? 20 : 10;

  const getHistory = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/v1/user/point/withdrawals?limit=${pageSize}&offset=${
          pageRef.current * pageSize
        }`
      );

      setData((prev) =>
        pageRef.current === 0
          ? response.data.data.list
          : [...prev, ...response.data.data.list]
      );
      setHasMore(response.data.data.has_next_page);
      if (response.data.data.has_next_page) {
        pageRef.current = pageRef.current + 1;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    hasMore,
    getHistory
  };
}
