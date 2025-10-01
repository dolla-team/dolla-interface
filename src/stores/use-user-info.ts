import { create } from "zustand/index";

interface UserInfoState {
  userInfo: any;
  prize: any;
  set: (params: any) => void;
  init: () => void;
}

const initialState = {
  userInfo: null,
  prize: {
    points: 0,
    tickets: 0
  }
} as UserInfoState;

const useUserInfoStore = create<UserInfoState>((set) => ({
  userInfo: null,
  prize: {
    points: 0,
    tickets: 0
  },
  set: (params) => set(() => ({ ...params })),
  init: () => set(() => initialState)
}));

export default useUserInfoStore;
