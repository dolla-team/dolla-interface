import clsx from "clsx";
import Button from "@/components/button";

export default function StarterObjectives() {
  return (
    <div className="border-t border-[#313038] px-[20px] py-[8px] text-white">
      <div className="flex items-center justify-between">
        <div className="text-[10px]">Starter Objectives</div>
        <div>
          <span className="text-[8px] text-white/30">Completed </span>
          <span className="text-[10px]"> 1/3</span>
        </div>
      </div>
      <Item type="Follow" />
      <Item type="Deposit" />
      <Item type="Bid" />
    </div>
  );
}

const Item = ({ type }: { type: "Follow" | "Deposit" | "Bid" }) => {
  return (
    <div
      className={clsx(
        "rounded-[10px] border border-[#F2F2F233] bg-[#F2F2F21A] backdrop-blur-[25px] mt-[10px] p-[10px] text-white"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px]">
          {type === "Follow" && "Follow us on X"}
          {type === "Deposit" && "Deposit at least $100"}
          {type === "Bid" && "Bid at least 10 times"}
        </span>
        <Button className="px-[7px] h-[26px] text-[10px] !rounded-[8px]">
          {type} {type === "Bid" && "now"}
        </Button>
        {/* <div className="flex items-center gap-[6px]">
          <span className="text-[8px] text-white/30">{type}ed</span>
          <CheckIcon />
        </div> */}
      </div>

      {type !== "Follow" && (
        <div className="w-full h-[6px] bg-[#F2F2F21A] rounded-[3px] backdrop-blur-[25px] mt-[10px]">
          <div
            className="h-full bg-[#00FFBB] rounded-[3px]"
            style={{ width: `30%` }}
          />
        </div>
      )}
    </div>
  );
};

const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <circle cx="8" cy="8" r="7.5" stroke="white" />
      <path
        d="M5 7.97379L7.52632 10.4738L12 5.99995"
        stroke="white"
        strokeLinecap="round"
      />
    </svg>
  );
};
