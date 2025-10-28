import clsx from "clsx";
import useTaskAction from "@/hooks/task/use-task-action";
import Button from "@/components/button";
import RefreshBtn from "./refresh-btn";
import useTaskStore from "@/stores/use-task";

export default function Task({
  className,
  id,
  task: defaultTask,
  onSuccess
}: {
  className?: string;
  id?: any;
  task?: any;
  onSuccess?: () => void;
}) {
  const taskStore = useTaskStore();
  const task = taskStore.tasksMap[id] || defaultTask;

  const {
    buttonText,
    handleTaskAction,
    loading,
    completed,
    claimed,
    progress,
    refreshing,
    fetchTaskStatus
  } = useTaskAction(task, onSuccess);

  return (
    task && (
      <div
        className={clsx(
          "w-[360px] bg-[#F0F0F0] border border-[#F2F2F233] rounded-[10px] py-[10px] px-[15px] mt-[10px]",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="text-[14px] text-black">{task.title}</div>
          {!claimed && (
            <div className="flex items-center gap-[10px] shrink-0">
              <RefreshBtn
                refreshing={refreshing}
                handleRefresh={fetchTaskStatus}
              />
              {(!!buttonText || completed) && (
                <Button
                  className="px-[7px] h-[26px] text-[10px] !bg-black !text-white !rounded-[8px] min-w-[60px] shrink-0"
                  loading={loading}
                  onClick={() => handleTaskAction()}
                >
                  {completed ? "Claim" : buttonText}
                </Button>
              )}
            </div>
          )}
          {claimed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <circle cx="10" cy="10" r="10" fill="#00DAA0" />
              <path
                d="M5.50049 10.5L9.00049 13.5L14.0001 7"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
        <div className="text-[#666666] text-[10px] mt-[6px]">
          {task.description}
        </div>
        <div className="mt-[10px] flex justify-between items-center">
          <div className="mt-[6px] w-[260px] h-[6px] rounded-[3px] bg-[#BDDCD4] backdrop-blur-[25px]">
            <div
              className="h-full bg-[#00CA94] rounded-[3px]"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="p-[5px] rounded-[12px] border border-[#383F47]/30 flex gap-[3px] items-center h-[24px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <circle cx="7" cy="7" r="7" fill="black" />
              <path
                d="M6.28261 3.45359C6.57606 2.85899 7.42394 2.85899 7.71739 3.45359L8.28333 4.6003C8.39986 4.83642 8.62511 5.00007 8.88568 5.03794L10.1512 5.22182C10.8073 5.31717 11.0693 6.12355 10.5945 6.58638L9.67882 7.47897C9.49027 7.66276 9.40423 7.92756 9.44874 8.18707L9.66491 9.44744C9.777 10.101 9.09105 10.5993 8.50415 10.2908L7.37227 9.69572C7.13921 9.57319 6.86079 9.57319 6.62773 9.69572L5.49585 10.2908C4.90895 10.5993 4.223 10.101 4.33509 9.44744L4.55126 8.18707C4.59577 7.92756 4.50973 7.66276 4.32118 7.47897L3.40548 6.58638C2.93066 6.12355 3.19267 5.31717 3.84885 5.22182L5.11432 5.03794C5.37489 5.00007 5.60014 4.83642 5.71667 4.6003L6.28261 3.45359Z"
                fill="white"
              />
            </svg>
            <div className="text-[12px] font-[500]">{task.points}</div>
          </div>
        </div>
      </div>
    )
  );
}
