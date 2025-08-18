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
        "text-white text-[14px] font-[400] leading-[100%] flex items-center gap-[10px]",
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
          "w-[17px] h-[17px] shrink-0 flex justify-center items-center rounded-full border border-[#743EFF] p-[3px] bg-black/20",
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
          <div className="w-full h-full rounded-full shrink-0 bg-[#743EFF]"></div>
        )}
      </div>
      <div className="">{children}</div>
    </div>
  );
};

export default Radio;
