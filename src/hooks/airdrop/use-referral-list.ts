import { useAuth } from "@/contexts/auth";
import axiosInstance from "@/libs/axios";
import { useEffect, useState } from "react";

const LIMIT = 10;

export default function useReferralList() {
  const [loading, setLoading] = useState(false);
  const [referralData, setReferralData] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const { userInfo } = useAuth();

  const getReferralList = async (page: number = 1) => {
    try {
      setLoading(true);
      const offset = (page - 1) * LIMIT;
      const res = await axiosInstance.get("/api/v1/airdrop/referral/list", {
        params: {
          limit: LIMIT,
          offset
        }
      });
      setReferralData(res.data.data);

      setCurrentPage(page);
      return res.data.data;
    } catch (err) {
      console.error("Failed to get referral list:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    getReferralList(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      getReferralList(currentPage - 1);
    }
  };

  useEffect(() => {
    if (userInfo?.user) {
      getReferralList();
    }
  }, [userInfo]);

  return {
    loading,
    referralData,
    currentPage,
    nextPage,
    prevPage
  };
}
