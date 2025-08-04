import { useContext, useState, useEffect, useCallback } from "react";
import { useNearWallet } from "../wallet/near";
import { createContext } from "react";
import useLogin from "@/hooks/use-login";
import useUserInfo from "@/hooks/use-user-info";

const AuthContext = createContext<any>(undefined);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { accountId, connectWallet, disconnectWallet } = useNearWallet();
  const [address, setAddress] = useState("");
  const { onLogin, loging } = useLogin();
  const { info: userInfo, onQueryUserInfo, setInfo } = useUserInfo(address);

  useEffect(() => {
    setAddress(accountId || "");
  }, [accountId]);

  const login = useCallback(async () => {
    if (!accountId) {
      connectWallet();
    } else {
      // Already connected, proceed with login
      await onQueryUserInfo();
    }
  }, [accountId, connectWallet, onQueryUserInfo]);

  const logout = useCallback(async () => {
    try {
      await disconnectWallet();
      localStorage.removeItem("_AK_TOKEN_");
      setInfo(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [disconnectWallet, setInfo]);

  return (
    <AuthContext.Provider
      value={{
        address,
        userInfo,
        logining: loging,
        login,
        logout,
        onQueryUserInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
