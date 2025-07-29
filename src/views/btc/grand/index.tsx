import GrandMobile from "./mobile";
import GrandLaptop from "./laptop";
import useIsMobile from "@/hooks/use-is-mobile";

export default function Grand(props: any) {
  const isMobile = useIsMobile();

  return isMobile ? <GrandMobile {...props} /> : <GrandLaptop {...props} />;
}
