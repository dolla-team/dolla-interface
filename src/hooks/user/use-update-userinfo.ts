import { useState, useCallback } from "react";
import axiosInstance from "@/libs/axios";
import useToast from "@/hooks/use-toast";
import useUpload from "@/hooks/use-upload";

interface UpdateUserInfoParams {
  name?: string;
  file?: Blob | null;
}

export default function useUpdateUserInfo(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { uploadFile } = useUpload();

  // Update user information
  const updateUserInfo = useCallback(
    async (params: UpdateUserInfoParams) => {
      const toastId = toast.loading({ title: "Updating..." });
      try {
        setLoading(true);

        let fileUrl = "";
        if (params.file) {
          fileUrl = (await uploadFile({
            dir: "user",
            file: params.file
          })) as any;
        }

        const args: any = {};

        if (params.name) {
          args.name = params.name;
        }

        if (fileUrl) {
          args.icon = fileUrl;
        }

        await axiosInstance.post("/api/v1/account", args);
        toast.dismiss(toastId);
        toast.success({ title: "Update successfully" });
        onSuccess?.();
      } catch (err: any) {
        console.error("Failed to update user info:", err);
        toast.dismiss(toastId);
        toast.fail({ title: err?.response?.data?.message || "Update failed" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, toast]
  );

  return {
    loading,
    updateUserInfo
  };
}
