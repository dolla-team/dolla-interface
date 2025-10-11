import clsx from "clsx";

const PopoverCard = (props: any) => {
  const { className, children } = props;

  return (
    <div
      className={clsx(
        "w-[116px] text-[#5E6B7D] rounded-[6px] text-[10px] font-[400] leading-[100%] p-[8px_10px] bg-[#fff] border border-[#E4E4E4] shadow-[0px_0px_6px_rgba(0,_0,_0,_0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PopoverCard;
