import clsx from "clsx";

const Radio = (props: any) => {
  const {
    checked,
    value,
    onChange,
    disabled,
    className,
    radioClassName,
    children,
    ...restProps
  } = props;

  return (
    <div
      className={clsx(
        "text-[#5E6B7D] text-[12px] font-[300] leading-[100%] flex items-center gap-[10px]",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        className
      )}
      onClick={() => {
        if (disabled) {
          return;
        }
        onChange?.(value);
      }}
    >
      <div
        className={clsx(
          "w-[17px] h-[17px] shrink-0 flex justify-center items-center rounded-full border border-[#E4E4E4] bg-white/60 p-[3px]",
          radioClassName
        )}
      >
        <input
          type="radio"
          checked={checked}
          disabled={disabled}
          value={value}
          className="hidden w-0 h-0 opacity-0"
          {...restProps}
        />
        {checked && (
          <div className="w-full h-full rounded-full shrink-0 bg-[#FFC42F]"></div>
        )}
      </div>
      <div className="">{children}</div>
    </div>
  );
};

export default Radio;
