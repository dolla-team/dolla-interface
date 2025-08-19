import Info from "../panels/info";
import Deposit from "../panels/deposit";

export default function Laptop() {
  return (
    <div
      className="fixed top-0 right-0 z-[100] h-screen w-[416px] border-l border-[#383F47] rounded-l-[16px]"
      style={{
        background:
          "radial-gradient(75.31% 36.96% at 1.18% 2.95%, rgba(111, 55, 255, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #1A1E24"
      }}
    >
      {/* <Info /> */}
      <Deposit />
      <div className="button absolute top-0 left-[-41px] w-[40px] h-full bg-[#141519CC] border-l border-[#373737] rounded-l-[16px] backdrop-blur-[10px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="18"
          viewBox="0 0 10 18"
          fill="none"
          className="mt-[24px] ml-[12px]"
        >
          <path
            d="M1 1L8 9L1 17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
