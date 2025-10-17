import WinResultLaptop from "./laptop";
import WinResultMobile from "./mobile";
import useIsMobile from "@/hooks/use-is-mobile";

export default function LucyDraw() {
  const isMobile = useIsMobile();

  return isMobile ? <WinResultMobile /> : <WinResultLaptop />;
}
