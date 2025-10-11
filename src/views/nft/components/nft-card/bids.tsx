export default function Bids({ rare, bids }: any) {
  const color = COLOR[rare] || COLOR[0];

  return (
    <div
      className="p-[6px] rounded-full inline-block absolute right-[10px] top-[120px] z-[10]"
      style={{ background: color.bg }}
    >
      <div
        className="text-[42px] font-[800] bg-black/69 rounded-full flex items-center justify-center duration-300"
        style={{
          width: `${SIZE[bids]}px`,
          height: `${SIZE[bids]}px`
        }}
      >
        <div
          style={{
            background: `linear-gradient(180deg, ${color.text[0]} 0%, ${color.text[1]} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          ${bids}
        </div>
      </div>
    </div>
  );
}

const SIZE: Record<number, number> = {
  1: 84,
  5: 84,
  10: 108,
  20: 120
};

const COLOR: Record<number, { text: string[]; bg: string }> = {
  0: {
    text: ["#FFFFFF", "#FFFFFF"],
    bg: "#fff"
  },
  3: {
    text: ["#C4ADFF", "#C4ADFF"],
    bg: "linear-gradient(to bottom, #C4ADFF, #8A5DFF)"
  },
  2: {
    text: ["#FF8A8A", "#FFFFFF"],
    bg: "linear-gradient(to bottom, #FF6565, #FFB1B1, #993C3C)"
  },
  1: {
    text: ["#FFDF8F", "#D4AA40"],
    bg: "linear-gradient(to bottom, #FDD777, #FEFFB1, #D2A53B)"
  }
};
