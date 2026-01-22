import clsx from "clsx";

export default function AnalyzeInputPanel({
  xProfileUrl,
  setXProfileUrl,
  isValid,
  onAnalyze,
  setIsBgSpread,
  onChangeHasAccount
}: any) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Prevent input if it contains spaces
    if (value.includes(" ")) {
      return;
    }
    setXProfileUrl(value);
  };
  return (
    <>
      <img src="/verify/verify-labels.png" className="absolute w-[154px] h-[122px] object-cover top-[60px] right-[20px]" />
      <div className="mt-[60px] text-white text-center text-[20px] font-semibold leading-[130%] uppercase">
        attempt to get access to dolla
      </div>
      <div className="text-center text-[16px] mt-[8px] font-[Courier] leading-[120%] tracking-[-1.08px] text-[#D9D9D9]">
        and get personalized probabilistic facts that you don't even know about yourself
      </div>
      <div className="flex justify-center gap-[25px] mt-[50px]">
        <div className="w-[400px]">
          <div className="h-[50px] rounded-[8px] bg-white backdrop-blur-[10px] p-[1px] border border-[#8A87AA4D]">
            <input
              value={xProfileUrl}
              onChange={handleInputChange}
              placeholder="Enter your X profile URL"
              className={clsx(
                "bg-transparent rounded-[8px] w-full h-full pl-[16px] text-[16px] text-[#000] border border-transparent",
                !isValid && "!border-[#F87168]"
              )}
              autoFocus={true}
            />
          </div>
        </div>
        <button
          onMouseEnter={() => setIsBgSpread(true)}
          onMouseLeave={() => setIsBgSpread(false)}
          onClick={() => {
            if (!isValid || xProfileUrl === "") {
              return;
            }
            onAnalyze();
          }}
          className={clsx(
            "button w-[126px] h-[50px] text-[16px] text-[#000] rounded-[8px] bg-gradient-to-r from-[#FFCE52] to-[#FFE9B2] shadow-[3px_3px_0_0_#AB6F00]"
          )}
        >
          Go
        </button>
      </div>
      {/* <div className="mt-[4px] text-center font-mono text-[18px] font-normal leading-[120%] tracking-[-1.08px] mt-[10px] text-[#8FFFC9]">5% to be investigate by @ZachXBT next.</div> */}
      <div onClick={() => onChangeHasAccount(true)} className="mt-[180px] text-center text-white text-[14px] leading-[130%] underline cursor-pointer">
        I already have an account
      </div>
    </>
  );
}