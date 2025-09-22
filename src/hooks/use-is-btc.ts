import { useMemo } from "react";

export default function useIsBtc() {
  return useMemo(() => {
    return (
      window.location.pathname.includes("/btc") ||
      window.location.pathname === "/"
    );
  }, [window.location.pathname]);
}
