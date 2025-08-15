import { useAuth } from "@/contexts/auth";
import Button from "./v2";

export default function ButtonWithAuth({
  children,
  className,
  disabled,
  onClick,
  ...rest
}: any) {
  const { userInfo, login, logining } = useAuth();

  if (!userInfo) {
    return (
      <Button onClick={login} className={className} loading={logining}>
        Connect Wallet
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      className={className}
      disabled={disabled}
      {...rest}
    >
      {children}
    </Button>
  );
}
