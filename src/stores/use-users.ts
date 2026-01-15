import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UsersState {
  users: Record<string, any>;
  set: (params: any) => void;
  setUsers: (info: Record<string, any>) => void;
}

export const useUsers = create(
  persist<UsersState>(
    (set) => ({
      users: {},
      set: (params) => set(() => ({ ...params })),
      setUsers: (info) =>
        set((state) => {
          const _users = { ...state.users, ...info };
          return { ...state, users: _users };
        })
    }),
    {
      name: "_users",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
