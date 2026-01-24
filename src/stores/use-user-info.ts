import { create } from "zustand/index";
import { createJSONStorage, persist } from 'zustand/middleware'

interface UserInfoState {
  userInfo: any;
  prize: any;
  showSetting: boolean;
  set: (params: any) => void;
  init: () => void;
}

const initialState = {
  userInfo: null,
  prize: {
    points: 0,
    tickets: 0
  },
  showSetting: false
} as UserInfoState;

const useUserInfoStore = create(
  persist<UserInfoState>(
    set => ({
      userInfo: null,
      prize: {
        points: 0,
        tickets: 0,
      },
      showSetting: false,
      set: params => set(() => ({ ...params })),
      init: () => set(() => initialState),
    }),
    {
      name: '_user-info',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useUserInfoStore;
