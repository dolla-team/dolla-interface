import Button from "@/components/button";
import DollaEye from "@/components/dolla-eye";
import { useEffect, useState } from "react";
import axios from "@/libs/axios";
import { useAuth } from "@/contexts/auth";
import { useGlobalStore } from "@/stores/use-global";

export default function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const { login, user } = useAuth();
  const globalStore = useGlobalStore();

  // Email format validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const emailError = touched && email && !isValidEmail(email);
  const canSubmit = email && isValidEmail(email);

  // Check if email is in whitelist
  const checkWhitelist = async (email: string): Promise<boolean> => {
    try {
      const res = await axios.get(
        `/api/v1/user/whitelist?email=${encodeURIComponent(email)}`
      );

      return res.data.data?.is_whitelist || false;
    } catch (err: any) {
      // If API returns error, consider it as not whitelisted
      console.error("Whitelist check failed:", err);
      return false;
    }
  };

  const handleSendCode = async () => {
    if (!canSubmit) return;

    setError("");
    setChecking(true);

    try {
      // Step 1: Check whitelist
      const isWhitelisted = await checkWhitelist(email);

      if (!isWhitelisted) {
        setError("You don't have permission");
        setChecking(false);
        return;
      }
      globalStore.set({
        email: email
      });
      login();
    } catch (err: any) {
      setError(String(err) || "Failed to send code");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (!email || !user?.email?.address) return;
    if (user.email.address !== email)
      setError(`Please login with the ${email} address`);
  }, [user]);

  return (
    <div className="w-screen h-screen bg-linear-to-b from-[#FFC42F00] to-[#FFC42F]/20 bg-white relative">
      <div className="flex flex-col items-center justify-center pt-[16%] w-full">
        <DollaEye className="" height={90} />
        <div className="text-[14px] mt-[40px]">Whitelist only for now</div>
      </div>
      <div className="absolute bottom-[100px] left-0 w-full flex flex-col items-center justify-center">
        <>
          <input
            className={`w-[300px] h-[50px] rounded-[10px] border p-[10px] text-[14px] text-center bg-white ${
              emailError ? "border-[#FF399F]" : "border-[#8A87AA4D]"
            }`}
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
          />
          {emailError && (
            <div className="mt-[10px] text-[#FF399F] text-[14px] h-[20px]">
              Please enter a valid email address
            </div>
          )}
          {error && (
            <div className="mt-[10px] text-[#FF399F] text-[14px] h-[20px]">
              {error}
            </div>
          )}
          <Button
            disabled={!canSubmit || checking}
            className="w-[300px] h-[50px] !bg-black !text-white mt-[16px]"
            onClick={handleSendCode}
          >
            {checking ? "Checking permission..." : "Check permission"}
          </Button>
        </>
      </div>
    </div>
  );
}
