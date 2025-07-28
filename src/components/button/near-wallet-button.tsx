import { useNearWallet } from "@/contexts/wallet/near";
import clsx from "clsx";
import useLogin from "@/hooks/use-login";
import { useEffect } from "react";

interface NearWalletButtonProps {
  className?: string;
}

export default function NearWalletButton({ className }: NearWalletButtonProps) {
  const { accountId, connectWallet, disconnectWallet, loading } = useNearWallet();
  const { signMessage, onLogin } = useLogin();

  // Auto-login when accountId changes
  useEffect(() => {
    const handleLogin = async () => {
      if (accountId) {
        try {
          // Create a message to sign
          const time = Date.now();
          const message = `login dolla, wallet_id:${accountId}, time:${time}`;
          
          // Sign the message
          const { signature, publicKey, nonce } = await signMessage(message);
          
          // Perform login with the signature
          await onLogin({
            address: accountId,
            signature,
            time,
            publicKey,
            nonce,
            onSuccess: () => {
              // Login successful - nothing to do here as the AuthProvider will handle updating the state
              console.log("Login successful");
            }
          });
        } catch (error) {
          console.error("Login failed:", error);
        }
      }
    };

    handleLogin();
  }, [accountId, signMessage, onLogin]);

  if (loading) {
    return (
      <button
        className={clsx(
          "px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed",
          className
        )}
        disabled
      >
        Loading...
      </button>
    );
  }

  if (accountId) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 truncate max-w-[120px]">
          {accountId}
        </span>
        <button
          onClick={disconnectWallet}
          className={clsx(
            "px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors",
            className
          )}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className={clsx(
        "px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors",
        className
      )}
    >
      Connect NEAR Wallet
    </button>
  );
}