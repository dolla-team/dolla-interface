import clsx from "clsx";

const Badge = (props: any) => {
  const { className, children, icon } = props;

  return (
    <button
      type="button"
      className={clsx(
        "cursor-pointer text-white font-[400] text-[12px] flex items-center gap-[4px] justify-center px-[9px] h-[20px] rounded-[10px] bg-black/20 backdrop-blur-[5px]",
        className
      )}
    >
      {typeof icon === "string" ? (
        <img
          src={icon}
          alt=""
          className="w-[12px] h-[12px] shrink-0 object-center object-contain"
        />
      ) : (
        icon
      )}
      <div className="">{children}</div>
    </button>
  );
};

export default Badge;
