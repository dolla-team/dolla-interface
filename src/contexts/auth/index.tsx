import {
  AuthContext as AuthPrivyContext,
  AuthProvider as AuthPrivyProvider
} from "./privy";
import { useContext } from "react";
import { CHAIN } from "@/config";

export const useAuth = () => {
  return useContext(AuthPrivyContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  if (CHAIN !== "near")
    return <AuthPrivyProvider>{children}</AuthPrivyProvider>;

  return <AuthPrivyProvider>{children}</AuthPrivyProvider>;
};
