import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HistoryType = "generate" | "parse" | "match";

export interface HistoryEntry {
  id: string;
  type: HistoryType;
  title: string;
  summary: string;
  timestamp: number;
  data: Record<string, unknown>;
}

interface HistoryState {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, "id" | "timestamp">) => void;
  removeEntry: (id: string) => void;
  clearAll: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],

      addEntry: (entry) =>
        set((s) => ({
          entries: [
            {
              ...entry,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              timestamp: Date.now(),
            },
            ...s.entries,
          ].slice(0, 100),
        })),

      removeEntry: (id) =>
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),

      clearAll: () => set({ entries: [] }),
    }),
    { name: "tianedaojia-history" }
  )
);
