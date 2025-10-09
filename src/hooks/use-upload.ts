import { useState, useCallback } from "react";
import axiosInstance from "@/libs/axios";

interface UploadParams {
  dir: string;
  file: Blob;
}

interface UploadResponse {
  code: number;
  data: {
    url: string;
    path: string;
  };
  message?: string;
}

export default function useUpload(onSuccess?: (url: string) => void) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Upload file to server
  const uploadFile = useCallback(
    async (params: UploadParams) => {
      try {
        setLoading(true);
        setProgress(0);

        const dir = "user";

        // Upload with progress tracking
        const fileName = Date.now().toString();
        const response = await axiosInstance.post<UploadResponse>(
          `/api/v1/upload/data?dir=${dir}&file_name=${fileName}`
        );

        if (response.data.code !== 0) {
          throw new Error(response.data.message);
        }

        const res = await fetch(response.data.data as any, {
          method: "PUT",
          body: params.file,
          headers: {
            "Content-Type": params.file.type
          }
        });

        if (res.ok) {
          onSuccess?.(`https://assets.dolla.market/${dir}/${fileName}`);
          return `https://assets.dolla.market/${dir}/${fileName}`;
        } else {
          throw new Error("Failed to upload file");
          return null;
        }
      } catch (err: any) {
        console.error("Failed to upload file:", err);

        throw err;
      } finally {
        setLoading(false);
        setProgress(0);
      }
    },
    [onSuccess]
  );

  return {
    loading,
    progress,
    uploadFile
  };
}
