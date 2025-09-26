import axiosInstance from "@/libs/axios";
import { useState } from "react";

export default function useCode() {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  const getCode = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/v1/airdrop/code");
      setCode(res.data.data);
      return res.data.data;
    } catch (err) {
      console.error("Failed to get code:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    code,
    getCode
  };
}
