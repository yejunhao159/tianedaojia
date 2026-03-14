import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChannelId, ScenarioId, ToneId } from "@modules/publish-service";

export type TaskStatus = "draft" | "generating" | "ready" | "publishing" | "published" | "failed";

export interface ChannelContent {
  channelId: ChannelId;
  text: string;
  imageUrl?: string;
  status: TaskStatus;
  publishedAt?: number;
  publishUrl?: string;
}

export interface RecruitTask {
  id: string;
  title: string;
  requirement: string;
  scenario: ScenarioId;
  tone: ToneId;
  channels: Record<ChannelId, ChannelContent>;
  score?: number;
  createdAt: number;
  updatedAt: number;
}

interface RecruitState {
  tasks: RecruitTask[];
  selectedTaskId: string | null;

  addTask: (task: Omit<RecruitTask, "id" | "createdAt" | "updatedAt">) => RecruitTask;
  updateTask: (id: string, patch: Partial<RecruitTask>) => void;
  updateChannel: (taskId: string, channelId: ChannelId, patch: Partial<ChannelContent>) => void;
  removeTask: (id: string) => void;
  selectTask: (id: string | null) => void;
  getTask: (id: string) => RecruitTask | undefined;
}

export const useRecruitStore = create<RecruitState>()(
  persist(
    (set, get) => ({
      tasks: [],
      selectedTaskId: null,

      addTask: (data) => {
        const task: RecruitTask = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({ tasks: [task, ...s.tasks] }));
        return task;
      },

      updateTask: (id, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t
          ),
        })),

      updateChannel: (taskId, channelId, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  updatedAt: Date.now(),
                  channels: {
                    ...t.channels,
                    [channelId]: { ...t.channels[channelId], ...patch },
                  },
                }
              : t
          ),
        })),

      removeTask: (id) =>
        set((s) => ({
          tasks: s.tasks.filter((t) => t.id !== id),
          selectedTaskId: s.selectedTaskId === id ? null : s.selectedTaskId,
        })),

      selectTask: (id) => set({ selectedTaskId: id }),

      getTask: (id) => get().tasks.find((t) => t.id === id),
    }),
    { name: "tianedaojia-recruit-tasks" }
  )
);
