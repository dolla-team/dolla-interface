import { useAuth } from "@/contexts/auth";
import { useGlobalStore } from "@/stores/use-global";
import Button from "@/components/button";
import { formatAddress } from "@/utils/format/address";
import { useEffect, useMemo, useState } from 'react'
import axios from "@/libs/axios";
import getCurrentAccount from '@/contexts/auth/get-current-account'


export default function LoginPanel({ onChangeHasAccount, setIsBgSpread }: any) {
  const { user, logout, login } = useAuth();
  const globalStore = useGlobalStore();
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const code = new URLSearchParams(window.location.search).get('code')

  // Check if email is in whitelist
  const checkWhitelist = async (
    email?: string,
    address?: string
  ): Promise<boolean> => {
    try {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code && code?.length === 6) {
        const res = await axios.get("/api/v1/airdrop/code/valid", {
          params: {
            code
          }
        });
        return res.data.data?.valid || false;
      }
      let path = "/api/v1/user/whitelist";
      const params = new URLSearchParams();
      if (email) params.append("email", email);
      if (address) params.append("address", address);
      const queryString = params.toString();
      if (queryString) {
        path += `?${queryString}`;
      }
      const res = await axios.get(path);

      return res.data.data?.is_whitelist || false;
    } catch (err: any) {
      // If API returns error, consider it as not whitelisted
      console.error("Whitelist check failed:", err);
      return false;
    }
  };

  const currentAccount = useMemo(() => {
    return getCurrentAccount(user)?.currentAccount
  }, [user])

  const handleSendCode = async () => {
    // if (!canSubmit) return;

    setError("");
    setChecking(true);

    try {
      const address = currentAccount?.address
      let email = user.email?.address || user.google?.email;
      if (user.twitter) {
        email = "@" + user.twitter.username;
      }

      // Step 1: Check whitelist
      const isWhitelisted = await checkWhitelist(email, address);

      if (!isWhitelisted) {
        setError("You don't have permission");
        setChecking(false)
      }
      globalStore.set({
        isInWhitelist: isWhitelisted,
      })
    } catch (err: any) {
      setError(String(err) || "Failed to send code");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    handleSendCode();
  }, [user]);

  return (
    <div className="h-[500px] flex flex-col items-center pt-[40px]">
      <div className="text-white text-[42px] text-center font-bold">Dolla Market </div>
      <div className="text-[#FFC42F] text-[18px] text-center uppercase">
         $1. Infinite Exposure.
      </div>
      <div className="mt-[8px] mb-[30px] text-white text-[12px] text-center w-[345px] leading-[130%]">
        Get exposure to bluechip assets that's out of reach, one dolla at a time.
      </div>
      {user ? (
        <div className="w-[300px] relative mt-[16px]">
          <Button
            disabled={checking}
            className="w-full h-[50px] relative z-[2] !bg-white !text-[#000] !justify-between pr-[10px]"
          >
            <span></span>
            {user.email?.address || user.google?.email || user.twitter?.name ? (
              <span className="text-[16px] font-[400]">
                {user.email?.address || user.google?.email || user.twitter?.name}
              </span>
            ) : (
              <span className="text-[16px] font-[400]">
                {' '}
                {formatAddress(currentAccount?.address, 5)}
              </span>
            )}
            <div
              className="p-[5px] button"
              onClick={() => {
                logout()
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="12"
                viewBox="0 0 11 12"
                fill="none"
              >
                <path
                  d="M0 6.00072V11.3082C0 11.6903 0.332601 12 0.744799 12H4.46595C4.87673 12 5.21075 11.6903 5.21075 11.3082C5.21075 10.9261 4.87815 10.6163 4.46595 10.6163H1.4896V1.38367H4.46737C4.87815 1.38367 5.21217 1.07394 5.21217 0.691835C5.21217 0.309734 4.87957 0 4.46737 0H0.744799C0.334023 0 0 0.309734 0 0.691835V6.00072ZM10.7669 5.49994C10.9105 5.62731 11 5.81112 11 6.0152C11 6.22072 10.9105 6.40309 10.7669 6.53045L8.41595 8.60596C8.29086 8.71596 8.12456 8.78398 7.94405 8.78398C7.55459 8.78398 7.23905 8.4728 7.23905 8.0907C7.23905 7.88662 7.33002 7.70281 7.47358 7.57689L8.45859 6.70703H4.18026C3.7908 6.70703 3.47526 6.3973 3.47526 6.0152C3.47526 5.6331 3.7908 5.32336 4.18026 5.32336H8.45574L7.47073 4.4535C7.32717 4.32758 7.23621 4.14232 7.23621 3.93825C7.23621 3.55614 7.55317 3.24641 7.94121 3.24641C8.12314 3.24641 8.28802 3.31299 8.4131 3.42444L10.7669 5.49994Z"
                  fill="black"
                />
              </svg>
            </div>
          </Button>
          {!globalStore.isInWhitelist && !checking && (
            <>
              <div className="w-[300px] h-[101px] mt-[-50px] pt-[56px] px-[4px] rounded-[10px] bg-[#FFC42F33] text-center text-[14px] text-[#FFC42F] font-[400px] leading-[120%]">
                Sorry, your account is temporarily unavailable
              </div>
              <div className="ml-[-40px] text-center text-[12px] text-[#8C8C8C] font-[300] w-[382px] mt-[10px]">
                Dolla Market is currently in private alpha. A whitelisted socials & address or a
                valid referral link is required. You can ask for a refferal link in the telegram.
              </div>
            </>
          )}
        </div>
      ) : (
        <Button
          className="w-[300px] h-[50px] !bg-[#FFB700] !text-[#000] mt-[16px] text-[14px]"
          onClick={() => {
            login()
            setIsBgSpread(true)
          }}
          onMouseOver={() => setIsBgSpread(true)}
          onMouseOut={() => setIsBgSpread(false)}
        >
          Sign In
        </Button>
      )}
      {!(code && code.length === 6) && (
        <div
          onClick={() => onChangeHasAccount(false)}
          className="mt-[40px] text-center text-white text-[14px] leading-[130%] underline cursor-pointer"
        >
          Back
        </div>
      )}
    </div>
  )
}