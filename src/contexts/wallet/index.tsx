import PrivyWalletProvider from "./privy";

export default function WalletProvider({
  children
}: {
  children: React.ReactNode;
}) {
  return <PrivyWalletProvider>{children}</PrivyWalletProvider>;
}
