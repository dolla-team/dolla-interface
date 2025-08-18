import NftCard from "@/components/nft-card";

// Mock data for NFT cards
const mockNftData = [
  {
    id: 1,
    rare: 0, // basic
    reward_token_info: [
      {
        icon: "/public/nfts/steady-teddys/1018.webp",
        name: "Steady Teddy",
        token_id: "1018"
      }
    ],
    reward_token_price: {
      last_price: 1250.5
    },
    participants: 156,
    accumulative_bids: 2340
  },
  {
    id: 2,
    rare: 1, // saudi
    reward_token_info: [
      {
        icon: "/public/nfts/steady-teddys/2016.webp",
        name: "Steady Teddy",
        token_id: "2016"
      }
    ],
    reward_token_price: {
      last_price: 2890.75
    },
    participants: 89,
    accumulative_bids: 5670
  },
  {
    id: 3,
    rare: 2, // redOg
    reward_token_info: [
      {
        icon: "/public/nfts/steady-teddys/2626.webp",
        name: "Steady Teddy",
        token_id: "2626"
      }
    ],
    reward_token_price: {
      last_price: 5200.0
    },
    participants: 234,
    accumulative_bids: 8900
  }
];

const TempPage: React.FC = () => {
  return (
    <div className="relative flex gap-[10px] flex-wrap">
      {mockNftData.map((data, index) => (
        <NftCard key={index} data={data} />
      ))}
    </div>
  );
};

export default TempPage;
