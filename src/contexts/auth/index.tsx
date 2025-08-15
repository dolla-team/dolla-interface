import {
  AuthContext as AuthPrivyContext,
  AuthProvider as AuthPrivyProvider
} from "./privy";
import { useContext } from "react";

export const useAuth = () => {
  return useContext(AuthPrivyContext);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthPrivyProvider>{children}</AuthPrivyProvider>;
};
