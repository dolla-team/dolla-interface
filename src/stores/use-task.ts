import { create } from "zustand";

interface TaskState {
  tasks: any[];
  progressTasks: any;
  completedTasks: any[];
  loading: boolean;
  initialized: boolean;
  isBid: boolean;
  set: (params: any) => void;
}

export const initProgressTasks: any = {
  "0": {
    title: "Social Tasks",
    list: []
  },
  "1": {
    title: "Referral Objectives",
    list: []
  },
  "2": {
    title: "Deposit Objectives",
    list: []
  },
  "3": {
    title: "Bid Objectives",
    list: []
  },
  "4": {
    title: "Swap Objectives",
    list: []
  }
};

const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  progressTasks: Object.values(initProgressTasks),
  completedTasks: [],
  loading: false,
  initialized: false,
  isBid: false,
  set: (params) => set(() => ({ ...params }))
}));

export default useTaskStore;
