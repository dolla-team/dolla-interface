import { create } from "zustand/index";

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

const useUserInfoStore = create<UserInfoState>((set) => ({
  userInfo: null,
  prize: {
    points: 0,
    tickets: 0
  },
  showSetting: false,
  set: (params) => set(() => ({ ...params })),
  init: () => set(() => initialState)
}));

export default useUserInfoStore;
