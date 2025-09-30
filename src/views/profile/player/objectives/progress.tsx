import Task from "./task";
import Loading from "@/components/icons/loading";

export default function Progress({
  tasks,
  loading
}: {
  tasks: any;
  loading: boolean;
}) {
  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center py-[20px]">
          <Loading size={20} />
        </div>
      ) : (
        tasks?.map((task: any) => (
          <div key={task.title}>
            <div className="text-[14px] font-[600] mt-[20px]">{task.title}</div>
            {task.list.map((item: any) => (
              <Task key={item.id} className="mt-[10px]" task={item} />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
