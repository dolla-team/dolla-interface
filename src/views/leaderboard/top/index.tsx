import TopItem from "./item";

export default function Top() {
  return (
    <div className="flex gap-[34px] mt-[50px] items-end justify-center">
      <TopItem className="w-[268px] h-[240px]" number={1} />
      <TopItem className="w-[268px] h-[259px]" number={2} />
      <TopItem className="w-[268px] h-[240px]" number={3} />
    </div>
  );
}
