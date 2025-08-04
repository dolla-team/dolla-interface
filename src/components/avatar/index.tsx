import clsx from "clsx";
// @ts-ignore
import crypto from "crypto-browserify";

export default function Avatar({
  size,
  src,
  email = "",
  className,
  address,
  onClick
}: {
  size: number;
  src?: string;
  email?: string;
  active?: boolean;
  className?: string;
  address?: string;
  onClick?: (e: any) => void;
}) {
  const hashedEmail =
    email || address
      ? crypto
          .createHash("sha256")
          .update((email || address)?.trim().toLowerCase())
          .digest("hex")
      : "";

  return (
    <img
      src={`/avatar/avatar.png`}
      alt="avatar"
      className={clsx("relative rounded-[6px]", className)}
      style={{
        width: size,
        height: size
      }}
      onClick={onClick}
    />
  );
}
