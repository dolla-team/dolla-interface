import clsx from "clsx";

const PopoverCard = (props: any) => {
  const { className, children } = props;

  return (
    <div
      className={clsx(
        "w-[116px] text-[#BBACA6] rounded-[6px] text-[10px] font-[400] leading-[100%] p-[8px_10px] bg-[#2D2B35] border border-[#514A5D] shadow-[0px_0px_6px_rgba(0,_0,_0,_0.25)] bg-[radial-gradient(25.97%_88.62%_at_6.81%_0%,_rgba(221,_144,_0,_0.10)_0%,_rgba(255,_196,_47,_0.00)_100%)]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PopoverCard;
