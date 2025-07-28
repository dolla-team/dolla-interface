import NearWalletProvider from "./near";
import { CHAIN } from "@/config";

export default function WalletProvider({
  children
}: {
  children: React.ReactNode;
}) {
  // Only NEAR chain is supported now
  return <NearWalletProvider>{children}</NearWalletProvider>;
}