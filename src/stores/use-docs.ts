import { create } from "zustand/index";

interface DocsState {
  showModal: boolean;
  set: (params: any) => void;
}

const useDocsStore = create<DocsState>((set) => ({
  showModal: false,
  set: (params) => set(() => ({ ...params }))
}));

export default useDocsStore;
