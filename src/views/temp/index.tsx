import { usePrivy } from "@privy-io/react-auth";
import Button from "@/components/button";

export default function TempPage() {
  const { exportWallet } = usePrivy();
  return (
    <div className="h-screen w-screen bg-white">
      <Button
        onClick={() => {
          exportWallet();
        }}
        className="h-[40px] w-[200px] !bg-black text-white"
      >
        Export Private Key
      </Button>
    </div>
  );
}
