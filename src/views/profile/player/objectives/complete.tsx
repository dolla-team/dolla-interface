import Loading from "@/components/icons/loading";
import Task from "./task";

export default function Complete({
  tasks,
  loading
}: {
  tasks: any;
  loading: boolean;
}) {
  return (
    <div className="pr-[20px]">
      <div className="flex items-center justify-between mb-[10px] mt-[10px]">
        <div className="text-[14px] font-[600]">Complete Objectives</div>
        <div className="text-[10px] text-[#8C8B8B]">
          {tasks.length} Complete
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        {loading ? (
          <div className="flex items-center justify-center py-[20px]">
            <Loading size={20} />
          </div>
        ) : (
          tasks?.map((task: any) => <Task key={task.title} task={task} />)
        )}
      </div>
    </div>
  );
}
