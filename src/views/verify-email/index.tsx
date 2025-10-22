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
    <div
      className="w-screen h-screen relative  overflow-hidden"
      style={{
        background:
          "radial-gradient(27.11% 21.64% at 74.31% 34.42%, rgba(255, 196, 47, 0.40) 0%, rgba(255, 196, 47, 0.00) 100%), #000"
      }}
    >
      <img
        src="/verify/verify-woman.png"
        className="absolute -bottom-[3.5%] -left-[3%] w-3xl object-cover"
      />
      <img
        src="/verify/verify-labels.png"
        className="absolute bottom-[10px] right-0 w-[185px] h-[151px] object-cover"
      />

      <div className="absolute bottom-[30px] right-[8%] flex flex-col items-center">
        <DollaEye className="" height={86} />
        <div className="text-[17px] text-white w-[528px] text-center leading-[160%] mt-[40px]">
          The first{" "}
          <span className="text-[26px] text-[#FFC42F] font-[600]">
            Trustless Probabilistic Marketplace
          </span>{" "}
          for BTC and more
        </div>
        <div className="text-[14px] mt-[80px] text-[#D9D9D9]">
          Whitelist only for now
        </div>
        <input
          className={`w-[300px] h-[50px] mt-[20px] rounded-[10px] border p-[10px] text-[14px] text-center bg-white ${
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
          className="w-[300px] h-[50px] !bg-[#FFB700] !text-[#000] mt-[16px]"
          onClick={handleSendCode}
        >
          {checking ? "Checking permission..." : "Check permission"}
        </Button>

        <button
          className="button flex items-center gap-[4px] mt-[120px]"
          onClick={() => {
            window.open("https://x.com/Dollamarket", "_blank");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <path
              d="M8.9285 6.35221L14.5135 0H13.1905L8.339 5.5144L4.467 0H0L5.8565 8.33955L0 15H1.323L6.443 9.17535L10.533 15H15M1.8005 0.976187H3.833L13.1895 14.0718H11.1565"
              fill="#8A87AA"
            />
          </svg>
          <span className="text-[#8A87AA] text-[14px]">Twitter</span>
        </button>
      </div>
    </div>
  );
}
