import clsx from "clsx";

export default function Hints({
  text,
  className
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "p-[20px] rounded-[12px] bg-[#FFFFFF1A] backdrop-blur-[25px] text-[16px] text-[#DCDCDC]",
        className
      )}
    >
      {text}
    </div>
  );
}
