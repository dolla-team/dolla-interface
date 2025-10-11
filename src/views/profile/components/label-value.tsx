import clsx from "clsx";

const LabelValue = (props: any) => {
  const { label, children, className, valueClassName } = props;

  return (
    <div
      className={clsx(
        "flex flex-col justify-center gap-[15px] text-[14px] font-[400] leading-[100%]",
        className
      )}
    >
      <div className="text-[12px] text-[#2B3337]">{label}</div>
      <div className={clsx("font-[DelaGothicOne] text-[16px]", valueClassName)}>
        {children}
      </div>
    </div>
  );
};

export default LabelValue;
