export default function TopWinnersContainer({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] bg-white backdrop-blur-[25px] h-full px-[20px] pt-[10px]">
      <div className="text-[18px] font-[700] text-black">{title}</div>
      {children}
    </div>
  );
}
