import clsx from "clsx";
// import CheckedIcon from "./checked-icon";

export default function NFTCard({
  checked = false,
  data,
  onSelect
}: {
  checked?: boolean;
  data: any;
  onSelect: () => void;
}) {
  return (
    <div
      className={clsx(
        "button rounded-[12px] bg-[#0B0D11] p-[12px_12px_0px] relative border duration-200 hover:border-[#743EFF]",
        checked
          ? "border-[#743EFF] w-[238px] h-[266px]"
          : "w-[128px] h-[160px] border-none"
      )}
      onClick={onSelect}
    >
      {data.icon ? (
        <img src={data.icon} className="w-full rounded-[4px]" />
      ) : (
        <div
          className={clsx(
            "w-full h-[100px] bg-[#272727] rounded-[4px]",
            checked ? "h-[210px]" : "h-[100px]"
          )}
        />
      )}
      <div
        className={clsx(
          "flex items-center text-white font-light text-[12px] mt-[14px] overflow-hidden line-clamp-2 leading-[14px]",
          checked ? "justify-between" : "justify-center"
        )}
      >
        <span> #{data.id}</span>
      </div>
      {/* <div className="absolute bottom-[-10px] right-[-8px]">
        {checked ? <CheckedIcon /> : <UncheckedIcon />}
      </div> */}
    </div>
  );
}
