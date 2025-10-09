import clsx from "clsx";
// @ts-ignore
import crypto from "crypto-browserify";
import { useRef } from "react";
import { AvatarColors } from "@/config/user";
import { useAuth } from "@/contexts/auth";

export default function Avatar({
  size,
  src,
  email = "",
  className,
  onClick
}: {
  size: number;
  src?: string;
  email?: string;
  active?: boolean;
  className?: string;
  onClick?: (e: any) => void;
}) {
  const { userInfo } = useAuth();
  const randomRef = useRef(Math.floor(Math.random() * AvatarColors.length));
  if (!src && !email) {
    return null;
  }

  if (!src && email) {
    return (
      <div
        className={clsx(
          "uppercase flex items-center justify-center rounded-[6px]",
          className
        )}
        style={{
          width: size,
          height: size,
          backgroundColor:
            userInfo?.show_email === email
              ? userInfo?.avatar_color
              : AvatarColors[randomRef.current]
        }}
      >
        {email.charAt(0)}
      </div>
    );
  }

  return (
    <img
      src={src}
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
