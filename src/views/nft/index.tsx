import { CannonCoinsProvider } from "./context";
import BackButton from "@/components/button/back-button";
import ShareButton from "@/components/button/share-button";
import NftContent from "./content";
import { useNavigate } from "@/libs/router";

export default function NewNft() {
  return (
    <CannonCoinsProvider>
      <Content />
    </CannonCoinsProvider>
  );
}

const Content = () => {
  const navigate = useNavigate();
  return (
    <div className="w-[1410px] mx-auto pt-[10px]">
      <div className="flex justify-between items-center">
        <BackButton
          onClick={() => {
            navigate("/nft");
          }}
        />
        <ShareButton />
      </div>
      <NftContent />
    </div>
  );
};
