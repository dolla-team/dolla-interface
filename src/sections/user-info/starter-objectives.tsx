import clsx from "clsx";
import Button from "@/components/button";
import Loading from "@/components/icons/loading";
import useTaskAction from "@/hooks/task/use-task-action";
import { useAuth } from "@/contexts/auth";
import useTaskStore from "@/stores/use-task";

export default function StarterObjectives() {
  const taskStore = useTaskStore();
  const { onQueryUserInfo } = useAuth();
  return (
    <div className="border-t border-[#313038] px-[20px] py-[8px] text-white h-[calc(100%-370px)]">
      <div className="flex items-center justify-between pb-[10px]">
        <div className="text-[10px]">Starter Objectives</div>
        {/* <div>
          <span className="text-[8px] text-white/30">Completed </span>
          <span className="text-[10px]"> 0/3</span>
        </div> */}
      </div>
      {taskStore.loading ? (
        <div className="flex items-center justify-center pt-[50px]">
          <Loading />
        </div>
      ) : (
        <div className="h-[calc(100%-20px)] overflow-y-auto flex flex-col gap-[10px]">
          {taskStore.tasks.map((task) => (
            <Item
              key={task.id}
              task={task}
              onSuccess={() => {
                onQueryUserInfo();
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const Item = ({ task, onSuccess }: { task: any; onSuccess: () => void }) => {
  const {
    buttonText,
    pastButtonText,
    handleTaskAction,
    loading,
    completed,
    claimed,
    progress
  } = useTaskAction(task, onSuccess);

  return (
    <div
      className={clsx(
        "rounded-[10px] border border-[#F2F2F233] bg-[#F2F2F21A] backdrop-blur-[25px] p-[10px] text-white"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px]">{task.title}</span>
        {claimed && (
          <div className="flex items-center gap-[6px]">
            <span className="text-[8px] text-white/30">{pastButtonText}</span>
            <CheckIcon />
          </div>
        )}
        {!claimed && (
          <Button
            className="px-[7px] h-[26px] text-[10px] !rounded-[8px] min-w-[60px]"
            loading={loading}
            onClick={() => handleTaskAction()}
          >
            {completed ? "Claim" : buttonText}
          </Button>
        )}
      </div>

      <div className="w-full h-[6px] bg-[#F2F2F21A] rounded-[3px] backdrop-blur-[25px] mt-[10px]">
        <div
          className="h-full bg-[#00FFBB] rounded-[3px]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
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
