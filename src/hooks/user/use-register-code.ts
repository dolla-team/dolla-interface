import { useEffect } from "react";
import { useAuth } from '@/contexts/wallet'
import { useSignMessage } from "@privy-io/react-auth";
import useToast from "../use-toast";
import useGenerateKey from "@/hooks/near/use-generate-key";
import axiosInstance from "@/libs/axios";

export default function useRegisterCode() {
  const { userInfo } = useAuth();
  const { signMessage } = useSignMessage();
  const { generateKeyPair } = useGenerateKey();
  const toast = useToast();
  const registerCode = new URLSearchParams(window.location.search).get(
    "registerCode"
  );

  useEffect(() => {
    if (!registerCode) return;
    if (!userInfo?.show_email) return;

    const bindingRegisterCode = async () => {
      const checkRes = await axiosInstance.get(
        "/api/v1/code/invite/gift/check",
        {
          params: {
            code: registerCode,
            email: userInfo.show_email
          }
        }
      );

      if (!checkRes.data.data?.is_valid) return;
      const { publicKey } = await generateKeyPair();
      if (!publicKey) {
        toast.info({
          title: "Generating key pair..., Please try again later."
        });
        return;
      }
      let toastId = toast.loading({ title: "Binding register code..." });
      try {
        const time = Date.now();
        const message = {
          user_id: { Evm: userInfo.user.replace(/^0x/, "").toLowerCase() },
          invite_code: registerCode,
          operation_key: publicKey
        };
        const { signature: privySignature } = await signMessage({
          message: JSON.stringify(message)
        });
        console.log(JSON.stringify(message), privySignature);
        const bindingRes = await axiosInstance.post(
          "/api/v1/code/invite/gift",
          {
            code: registerCode,
            signature: privySignature.replace(/^0x/, ""),
            email: userInfo.show_email,
            public_key: publicKey,
            time: time
          }
        );
        toast.dismiss(toastId);
        if (bindingRes.data.code !== 0) {
          toast.fail({ title: "Binding register code failed" });
          return;
        }
        toast.success({ title: "Binding register code successfully" });
      } catch (error) {
        console.error("Binding register code error:", error);
        toast.dismiss(toastId);
        toast.fail({ title: "Binding register code failed" });
      }
    };
    bindingRegisterCode();
  }, [registerCode, userInfo?.user]);
  return {
    registerCode
  };
}
