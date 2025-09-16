export default function TopWinnersContainer({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] bg-white backdrop-blur-[25px] h-full pt-[10px]">
      <div className="text-[18px] font-[700] text-black px-[20px]">{title}</div>
      <div className="h-[calc(154px-45px)] overflow-y-auto px-[20px] pt-[5px]">
        {children}
      </div>
    </div>
  );
}
