import Button from "@/components/button";

export default function SubmitBtn({
  errorTips,
  disabled,
  onClick,
  children,
  loading
}: any) {
  if (loading) {
    return (
      <Button loading className="h-[42px] !bg-[#FFC42F] w-full mt-[16px]">
        Swap
      </Button>
    );
  }
  if (errorTips) {
    return (
      <Button className="h-[42px] !bg-[#FFC42F] w-full mt-[16px]" disabled>
        {errorTips}
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="h-[42px] !bg-[#FFC42F] w-full mt-[16px]"
    >
      {children ? children : "Swap"}
    </Button>
  );
}
