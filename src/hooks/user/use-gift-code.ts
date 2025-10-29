import { useAuth } from "@/contexts/auth";
import { useSignMessage } from "@privy-io/react-auth";
import useToast from "../use-toast";
import useGenerateKey from "@/hooks/near/use-generate-key";
import axiosInstance from "@/libs/axios";
import { useEffect, useState } from "react";

export default function useRegisterCode({
  onSuccess
}: {
  onSuccess: () => void;
}) {
  const [giftCode, setGiftCode] = useState("");
  const { userInfo } = useAuth();
  const { signMessage } = useSignMessage();
  const { generateKeyPair } = useGenerateKey();
  const [binding, setBinding] = useState(false);
  const [codeValidate, setCodeValidate] = useState<{
    is_valid: boolean;
    msg: string;
  } | null>(null);
  const toast = useToast();

  const bindGiftCode = async (code: string) => {
    if (!code) return;
    if (!userInfo?.show_email) return;

    if (giftCode.trim().length !== 20) {
      setCodeValidate({
        is_valid: false,
        msg: "This code is invalid"
      });
      return;
    }

    let toastId = toast.loading({ title: "Binding gift code..." });
    try {
      let bindingRes: any = null;

      const { publicKey, isRegistered } = await generateKeyPair(true);

      if (!publicKey && !isRegistered) {
        toast.info({
          title: "Please login to bind gift code"
        });
        return;
      }
      setBinding(true);
      // new account
      if (!isRegistered) {
        const checkRes = await axiosInstance.get(
          "/api/v1/code/invite/gift/check",
          {
            params: {
              code: giftCode.trim(),
              email: userInfo.show_email
            }
          }
        );

        if (!checkRes.data.data?.is_valid) {
          toast.dismiss(toastId);
          setCodeValidate({
            is_valid: false,
            msg: "This code is invalid"
          });
          return;
        }
        const time = Date.now();
        const message = {
          user_id: { Evm: userInfo.user.replace(/^0x/, "").toLowerCase() },
          invite_code: code,
          operation_key: publicKey
        };
        const { signature: privySignature } = await signMessage({
          message: JSON.stringify(message)
        });

        bindingRes = await axiosInstance.post("/api/v1/code/invite/gift", {
          code: code,
          signature: privySignature.replace(/^0x/, ""),
          email: userInfo.show_email,
          public_key: publicKey,
          time: time
        });
      } else {
        // old account
        bindingRes = await axiosInstance.post("/api/v1/gift/voucher", {
          code: code
        });
      }
      toast.dismiss(toastId);
      if (bindingRes?.data?.code !== 0) {
        toast.fail({
          title: bindingRes?.data?.message || "Binding gift code failed"
        });
        setCodeValidate({
          is_valid: false,
          msg: bindingRes?.data?.message || "This code is invalid"
        });
        return;
      }
      onSuccess();
      toast.success({ title: "Binding gift code successfully" });
    } catch (error) {
      console.error("Binding gift code error:", error);
      toast.dismiss(toastId);

      toast.fail({ title: "Binding gift code failed" });
    } finally {
      setBinding(false);
    }
  };

  useEffect(() => {
    setCodeValidate(null);
  }, [giftCode]);

  return {
    binding,
    bindGiftCode,
    codeValidate,
    giftCode,
    setGiftCode
  };
}
