import AnimatedCounter from "@/components/animated-counter";

export default function TempPage() {
  return (
    <div className="h-screen w-screen bg-white">
      <div>
        <AnimatedCounter value={1234567} prefix="$" />
      </div>
      <AnimatedCounter value={3.14} decimals={2} suffix="%" />
    </div>
  );
}
