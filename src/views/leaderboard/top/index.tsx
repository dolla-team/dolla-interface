import TopItem from "./item";

export default function Top({ top3Winners }: { top3Winners: any[] }) {
  return (
    <div className="flex gap-[34px] mt-[30px] items-end justify-center">
      <TopItem
        className="w-[268px] h-[240px]"
        number={1}
        data={top3Winners[1]}
      />
      <TopItem
        className="w-[268px] h-[259px]"
        number={2}
        data={top3Winners[0]}
      />
      <TopItem
        className="w-[268px] h-[240px]"
        number={3}
        data={top3Winners[2]}
      />
    </div>
  );
}
