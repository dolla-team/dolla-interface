import clsx from "clsx";

export default function Title(props: any) {
  const { className } = props;

  return (
    <div
      className={clsx(
        "absolute top-[14px] left-[20px] flex items-center gap-[6px] text-[12px] font-[400] leading-[100%]",
        className
      )}
    >
      <span className="text-[#8A87AA]">Probability Weighted Sales</span>
      <button className="button relative group">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M7 0C10.8658 0.000201452 14 3.13413 14 7C14 10.8659 10.8658 13.9998 7 14C3.13404 14 0 10.866 0 7C0 3.13401 3.13404 0 7 0ZM7 1C3.68632 1 1 3.68629 1 7C1 10.3137 3.68632 13 7 13C10.3135 12.9998 13 10.3136 13 7C13 3.68642 10.3135 1.0002 7 1ZM7.2998 9.3877C7.6198 9.3877 7.88849 9.49591 8.10449 9.71191C8.3202 9.91982 8.42768 10.1916 8.42773 10.5273C8.42773 10.8632 8.32032 11.1395 8.10449 11.3555C7.88849 11.5635 7.6198 11.668 7.2998 11.668C6.97195 11.6679 6.6956 11.5634 6.47168 11.3555C6.25588 11.1395 6.14844 10.8632 6.14844 10.5273C6.14849 10.1917 6.256 9.91981 6.47168 9.71191C6.6956 9.49599 6.97195 9.38777 7.2998 9.3877ZM8.05566 8.73926H6.52051V3.09961H8.05566V8.73926Z"
            fill="#8A87AA"
          />
        </svg>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute top-[-60px] left-[50%] translate-x-[-50%] w-[254px] h-[51px] bg-white border border-[#E4E4E4] px-[11px] pt-[6px] rounded-[6px] pointer-events-none">
          <div className="text-[12px] text-left text-[#8A87AA]">
            This Probability weighted sales is projected based on 10,000
            simulations.
          </div>
          <div className="absolute bottom-[-6px] left-[50%] translate-x-[-50%] w-[12px] h-[12px] bg-white  border border-transparent border-b-[#E4E4E4] border-r-[#E4E4E4] rounded-[2px] rotate-45"></div>
        </div>
      </button>
    </div>
  );
}
