import LevelIcon from "@/components/icons/level-icon";
import { useAuth } from "@/contexts/auth";

export default function Level() {
  const { userInfo } = useAuth();

  return (
    <div className="mt-[16px] px-[20px]">
      <div className="flex justify-between items-center text-white">
        <div className="flex items-center gap-[6px]">
          <LevelIcon />
          <span className="text-[12px]">Lv. {userInfo?.level}</span>
        </div>
        <div className="text-[12px]">
          {userInfo?.current_points} / {userInfo?.next_level_points} XP
        </div>
      </div>
      <div className="mt-[6px] w-[254px] h-[6px] rounded-[3px] bg-[#F2F2F21A] backdrop-blur-[25px]">
        <div
          className="h-full bg-white rounded-[3px]"
          style={{ width: `${userInfo?.points_progress || 0}%` }}
        />
      </div>
    </div>
  );
}
