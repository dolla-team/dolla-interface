import { useMemo } from "react";

export default function Probability({
  probability,
  probabilities
}: {
  probability: number;
  probabilities: number[];
}) {
  const [width] = useMemo(() => {
    let index = 0;
    let diff = 0;
    probabilities.forEach((item, i) => {
      if (probability >= item) {
        diff =
          ((probability - item) / (probabilities[i + 1] - item)) * 288 * 0.25;
        index = i;
      }
    });
    console.log(index, diff);
    if (index === 0) {
      return [288 * 0.25 + diff];
    }
    if (index === 1) {
      return [288 * 0.5 + diff];
    }
    if (index === 2) {
      return [288 * 0.75 + diff];
    }
    if (index === 3) {
      return [288];
    }

    return [288];
  }, [probability, probabilities]);

  return (
    <div className="w-[288px]">
      <div className="text-[#8A87AA] text-[14px]">Probability</div>
      <div className="flex justify-between items-center mt-[20px]">
        {probabilities.map((item) => (
          <div key={item} className="text-[#8A87AA] text-[14px]">
            {item}%
          </div>
        ))}
      </div>
      <div className="w-full h-[12px] rounded-[20px] border border-[#E4E4E4] bg-[#FFFFFF99] mt-[10px]">
        <div
          className="h-full rounded-[20px] bg-[#6F37FF]"
          style={{ width: `${width}px` }}
        />
      </div>
    </div>
  );
}
