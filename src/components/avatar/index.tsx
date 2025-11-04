import clsx from "clsx";
import { useMemo } from "react";

export default function Avatar({
  size,
  src,
  className,
  address,
  onClick
}: {
  size: number;
  src?: string;
  email?: string;
  address?: string;
  active?: boolean;
  className?: string;
  onClick?: (e: any) => void;
}) {
  const mergedSrc = useMemo(() => {
    if (src) return src;
    if (!address) return null;

    const random = (parseInt(address.slice(2, 5), 16) % 45) + 1;
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
