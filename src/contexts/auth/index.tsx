import {
  AuthContext as AuthPrivyContext,
  AuthProvider as AuthPrivyProvider
} from "./privy";
import { useContext } from "react";
import useContractConfig from "@/hooks/near/use-config";

export const useAuth = () => {
  return useContext(AuthPrivyContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useContractConfig();
  return <AuthPrivyProvider>{children}</AuthPrivyProvider>;
};
