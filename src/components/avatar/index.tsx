import clsx from "clsx";
import { useMemo } from "react";
import {
  isValidSolanaAddress,
  isValidEVMAddress
} from "@/utils/validate-address";

export default function Avatar({
  size,
  src,
  className,
  address,
  onClick
}: {
  size: number;
  src?: string;
  address?: string;
  active?: boolean;
  className?: string;
  onClick?: (e: any) => void;
}) {
  const mergedSrc = useMemo(() => {
    if (src) return src;
    if (!address) return null;

    let random: number;

    // Check if it's a Solana address
    if (isValidSolanaAddress(address)) {
      // Calculate random from Solana address using first few characters
      // Sum character codes of first 6 characters and take modulo
      const charSum = address
        .slice(0, 6)
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);
      random = (charSum % 45) + 1;
    } else if (isValidEVMAddress(address)) {
      // EVM address (starts with 0x)
      random = (parseInt(address.slice(2, 5), 16) % 45) + 1;
    } else {
      // Fallback for other address formats
      const charSum = address
        .slice(0, 6)
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);
      random = (charSum % 45) + 1;
    }

    return `https://assets.dolla.market/avatar/${random}.jpg`;
  }, [src, address]);

  if (!mergedSrc) {
    return null;
  }

  return (
    <img
      src={mergedSrc}
      alt="avatar"
      className={clsx("rounded-[6px]", className)}
      style={{
        width: size,
        height: size
      }}
      onClick={onClick}
    />
  );
}
