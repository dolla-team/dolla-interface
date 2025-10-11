import { useCallback } from "react";
import axiosInstance from "@/libs/axios";

// Type definitions for the report API
export interface ReportParams {
  address: string;
  type: string;
}

export interface ReportResponse {
  success: boolean;
  data?: any;
  message?: string;
}

export default function useReport() {
  // Report function that sends data to the API
  const report = useCallback(async (params: ReportParams) => {
    try {
      await axiosInstance.post<ReportResponse>("/api/v1/chaindefuser/report", {
        address: params.address,
        type: params.type
      });
    } catch (err: any) {
      throw err;
    }
  }, []);

  return {
    report
  };
}
