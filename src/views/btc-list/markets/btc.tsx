export default function BtcImg({ amount }: { amount: string }) {
  return (
    <div className="w-[52px] h-[52px] bg-[url('/home/btc-img-small.png')] bg-cover bg-center relative">
      <span
        className="text-[8px] font-semibold absolute bottom-[4px] w-full text-center"
        style={{
          background: "linear-gradient(180deg, #B67C23 0%, #503610 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          WebkitTextStrokeWidth: "0.6px",
          WebkitTextStrokeColor: "#000"
        }}
      >
        {amount} BTC
      </span>
    </div>
  );
}
