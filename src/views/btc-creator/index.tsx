import BtcGameCreator from "@/views/btc-creator/btc-game-creator";

export default function BtcCreatorPage() {
  return (
    <div className="min-h-screen h-screen bg-black text-white overflow-y-auto">
      <div className="mx-auto px-6 pb-20 pt-[80px]">
        <BtcGameCreator />
      </div>
    </div>
  );
}
