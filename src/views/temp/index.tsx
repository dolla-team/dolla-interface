import useDraw from "@/hooks/evm/use-draw";
import Button from "@/components/button/v2";

const TempPage: React.FC = () => {
  const { onDraw, drawing } = useDraw(
    () => {
      console.log("success");
    },
    () => {
      console.log("error");
    }
  );
  return (
    <div className="relative flex gap-[10px]">
      <Button onClick={() => onDraw(2, 1)} disabled={drawing}>
        Draw
      </Button>
    </div>
  );
};

export default TempPage;
