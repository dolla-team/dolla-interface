import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface HistoryState {
  history: Record<string, any>;
  pendingStatus: any[];
  addHistory: (item: any) => void;
  updateStatus: (address: string, status: any) => void;
  updateHistory: (address?: string, item?: any) => void;
}

export const useHistoryStore = create(
  persist<HistoryState>(
    (set, get) => ({
      history: {},
      pendingStatus: [],
      addHistory: (item: any) => {
        const _history = get().history;
        _history[item.despoitAddress] = item;
        set({
          history: _history
        });
      },
      updateStatus: (address: string, status: any) => {
        if (!address) return;
        const _pendingStatus = get().pendingStatus;
        const _history = get().history;
        const _index = _pendingStatus.indexOf(address);

        if (status === "PENDING_DEPOSIT" || status === "PROCESSING") {
          if (_index === -1) _pendingStatus.unshift(address);
        } else {
          if (_index !== -1) {
            _pendingStatus.splice(_index, 1);

            delete _history[address];
          }
        }

        set({
          pendingStatus: _pendingStatus,
          history: _history
        });
      },
      updateHistory: (address, item) => {
        if (!address || !item) return;
        const _history = get().history;
        if (!_history[address]) return;
        for (const key in item) {
          _history[address][key] = item[key];
        }
        set({ history: _history });
      }
    }),
    {
      name: "_swap_history",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
