import axiosInstance from "@/libs/axios";
import { useState } from "react";
import useToast from "@/hooks/use-toast";

export default function useBindingCode() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const bindingCode = async (code: string) => {
    if (loading) return;

    let toastId = toast.loading({ title: "Binding code..." });
    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/v1/airdrop/binding/code", {
        code
      });
      toast.dismiss(toastId);

      if (res.data.code === 0) {
        toast.success({ title: "Code binding successful" });
      } else if (res.data.message) {
        toast.fail({ title: res.data.message });
      }

      return res.data;
    } catch (err) {
      toast.dismiss(toastId);
      toast.fail({ title: "Code binding failed" });
      console.error("Failed to binding code:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    bindingCode
  };
}
