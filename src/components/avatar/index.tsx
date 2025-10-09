import clsx from "clsx";
// @ts-ignore
import crypto from "crypto-browserify";
import { useRef } from "react";
import { AvatarColors } from "@/config/user";
import { useUsers } from "@/stores/use-users";

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
  address?: string;
  active?: boolean;
  className?: string;
  onClick?: (e: any) => void;
}) {
  const usersStore = useUsers();
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
            (address && usersStore.users[address.toLowerCase()]?.color) ||
            AvatarColors[randomRef.current]
        }}
        onClick={onClick}
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
