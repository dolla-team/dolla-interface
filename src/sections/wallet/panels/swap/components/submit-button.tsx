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
      <Button
        loading
        className="h-[42px] !bg-black w-full mt-[16px] !text-white"
      >
        Swap
      </Button>
    );
  }
  if (errorTips) {
    return (
      <Button
        className="h-[42px] !bg-black w-full mt-[16px] !text-white"
        disabled
      >
        {errorTips}
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="h-[42px] !bg-black w-full mt-[16px] !text-white"
    >
      {children ? children : "Swap"}
    </Button>
  );
}
