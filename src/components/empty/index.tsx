import clsx from "clsx";

const Empty = (props: any) => {
  const { className, children = "No data" } = props;

  return (
    <div
      className={clsx(
        "w-full py-[100px] flex items-center justify-center",
        "text-[#8A87AA] text-[14px] font-normal leading-[14px]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Empty;
