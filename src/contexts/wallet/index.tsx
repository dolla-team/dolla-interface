import NearWalletProvider from "./near";
import PrivyWalletProvider from "./privy";
import { CHAIN } from "@/config";

export default function WalletProvider({
  children
}: {
  children: React.ReactNode;
}) {
  if (CHAIN === "near")
    return <NearWalletProvider>{children}</NearWalletProvider>;

  return <PrivyWalletProvider>{children}</PrivyWalletProvider>;
}
