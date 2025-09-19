import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function useIsBtc() {
  const { pathname } = useLocation();
  return useMemo(() => {
    return pathname.includes("/btc") || pathname === "/";
  }, [pathname]);
}
