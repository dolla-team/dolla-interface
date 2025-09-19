import clsx from "clsx";

export default function Title(props: any) {
  const { className } = props;

  return (
    <div
      className={clsx(
        "absolute top-[14px] left-[20px] flex items-center gap-[6px] text-white text-[14px] font-[400] leading-[100%]",
        className
      )}
    >
      <span className="">Probability Weighted Sales</span>
      <button className="button relative group">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
        >
          <path
            d="M7.5 0.5C11.366 0.5 14.5 3.63401 14.5 7.5C14.5 11.366 11.366 14.5 7.5 14.5C3.63401 14.5 0.5 11.366 0.5 7.5C0.5 3.63401 3.63401 0.5 7.5 0.5ZM7.5 1.5C4.18629 1.5 1.5 4.18629 1.5 7.5C1.5 10.8137 4.18629 13.5 7.5 13.5C10.8137 13.5 13.5 10.8137 13.5 7.5C13.5 4.18629 10.8137 1.5 7.5 1.5ZM7.80078 9.8877C8.12063 9.88777 8.38857 9.99599 8.60449 10.2119C8.82032 10.4198 8.92865 10.6916 8.92871 11.0273C8.92871 11.3633 8.82043 11.6395 8.60449 11.8555C8.38857 12.0634 8.12063 12.1679 7.80078 12.168C7.4728 12.168 7.19665 12.0634 6.97266 11.8555C6.75666 11.6395 6.64844 11.3633 6.64844 11.0273C6.64849 10.6915 6.75674 10.4199 6.97266 10.2119C7.19666 9.99591 7.47278 9.8877 7.80078 9.8877ZM8.55664 9.23926H7.02051V3.59961H8.55664V9.23926Z"
            fill="#5E6B7D"
          />
        </svg>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-[-60px] left-[50%] translate-x-[-50%] w-[254px] h-[51px] bg-[#131313] border border-[#484848] px-[11px] pt-[6px] rounded-[6px] pointer-events-none">
          <div className="text-[12px] text-left">
            This Probability weighted sales is projected based on 10,000
            simulations.
          </div>
          <div className="absolute bottom-[-6px] left-[50%] translate-x-[-50%] w-[12px] h-[12px] bg-[#131313] border border-transparent border-b-[#484848] border-r-[#484848] rounded-[2px] rotate-45"></div>
        </div>
      </button>
    </div>
  );
}
