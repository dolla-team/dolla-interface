import { useCallback, useState } from "react";
import axios from "@/libs/axios";
import useUserPrize from "@/hooks/use-user-prize";
import useUserInfoStore from "@/stores/use-user-info";

export default function useUserInfo(address?: string, user?: any) {
  const [loading, setLoading] = useState(false)
  const { getUserPrize } = useUserPrize()
  const userInfoStore = useUserInfoStore()

  const onQueryUserInfo = useCallback(async () => {
    if (!address) {
      return
    }

    setLoading(true)

    try {
      const res = await axios.get('/api/v1/user?chain=near')
      const _info = res.data.data

      const progress = (() => {
        if (!_info?.current_points || !_info?.next_level_points) {
          return 0
        }
        return (_info.current_points / _info.next_level_points) * 100
      })()

      _info.points_progress = progress

      if (!_info?.name) {
        userInfoStore.set({ showSetting: true, settingFrom: 'init' })
        if (user.twitter) {
          _info.name = user.twitter.name
          _info.icon = user.twitter.profilePictureUrl
        }
      }
      userInfoStore.set({
        userInfo: { ..._info, user: _info.user || address },
      })
      getUserPrize()
    } catch (err) {
      console.log('err', err)
      userInfoStore.set({ userInfo: null })
    } finally {
      setLoading(false)
    }
  }, [address, user])

  return { loading, onQueryUserInfo }
}
