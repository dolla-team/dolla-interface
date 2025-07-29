import useIsMobile from "@/hooks/use-is-mobile";
import MobileMarketInfo from "./mobile";
import LaptopMarketInfo from "./laptop";

export default function MarketInfo() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileMarketInfo /> : <LaptopMarketInfo />;
}
