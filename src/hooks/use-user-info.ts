import { useCallback, useEffect, useState } from "react";
import axios from "@/libs/axios";
import { useUsers } from "@/stores/use-users";
import useUserPrize from "@/hooks/use-user-prize";
import { AvatarColors } from "@/config/user";
import useUserInfoStore from "@/stores/use-user-info";

export default function useUserInfo(address?: string) {
  const [info, setInfo] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { getUserPrize } = useUserPrize();
  const usersStore = useUsers();
  const userInfoStore = useUserInfoStore();

  const onQueryUserInfo = useCallback(async () => {
    if (!address) {
      return;
    }

    setLoading(true);

    try {
      const res = await axios.get("/api/v1/user?chain=near");
      const _info = res.data.data;

      if (!_info.icon) {
        if (usersStore.users[address.toLowerCase()]) {
          _info.icon = usersStore.users[address.toLowerCase()].icon;
        } else {
          const random = Math.floor(Math.random() * AvatarColors.length);
          usersStore.setUsers({
            [address.toLowerCase()]: {
              color: AvatarColors[random]
            }
          });
        }
      }
      const progress = (() => {
        if (!_info?.current_points || !_info?.next_level_points) {
          return 0;
        }
        return (_info.current_points / _info.next_level_points) * 100;
      })();

      _info.points_progress = progress;

      if (!_info?.name) userInfoStore.set({ showSetting: true });
      setInfo(_info);
      getUserPrize();
    } catch (err) {
      console.log("err", err);
      setInfo(null);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (address) {
      onQueryUserInfo();
    }
  }, [address]);

  return { info, loading, onQueryUserInfo, setInfo };
}
