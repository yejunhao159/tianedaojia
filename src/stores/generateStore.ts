import { create } from "zustand";
import pLimit from "p-limit";
import { CHANNEL_IDS, CHANNELS } from "@/lib/channels";
import { fetchGenerateStream, fetchGenerateImage } from "@/lib/services/generateService";
import { useHistoryStore } from "./historyStore";
import type { ChannelId, ScenarioId, ToneId } from "@/types";

type Status = "idle" | "generating" | "done" | "error";

interface GenerateState {
  requirement: string;
  scenario: ScenarioId;
  tone: ToneId;
  contents: Record<ChannelId, string>;
  statuses: Record<ChannelId, Status>;
  images: Record<ChannelId, string[]>;
  isGenerating: boolean;

  setRequirement: (v: string) => void;
  setScenario: (v: ScenarioId) => void;
  setTone: (v: ToneId) => void;
  updateContent: (ch: ChannelId, text: string) => void;
  batchGenerate: () => Promise<void>;
}

const empty = <T,>(val: T) =>
  Object.fromEntries(CHANNEL_IDS.map((id) => [id, val])) as Record<ChannelId, T>;

const textLimit = pLimit(2);

export const useGenerateStore = create<GenerateState>((set, get) => ({
  requirement: "",
  scenario: "nanny",
  tone: "friendly",
  contents: empty(""),
  statuses: empty<Status>("idle"),
  images: empty<string[]>([]),
  isGenerating: false,

  setRequirement: (v) => set({ requirement: v }),
  setScenario: (v) => set({ scenario: v }),
  setTone: (v) => set({ tone: v }),

  updateContent: (ch, text) =>
    set((s) => ({ contents: { ...s.contents, [ch]: text } })),

  batchGenerate: async () => {
    const { requirement, scenario, tone } = get();
    if (!requirement.trim()) return;

    set({
      isGenerating: true,
      contents: empty(""),
      statuses: empty<Status>("idle"),
      images: empty<string[]>([]),
    });

    const textTasks = CHANNEL_IDS.map((ch) =>
      textLimit(async () => {
        set((s) => ({ statuses: { ...s.statuses, [ch]: "generating" } }));
        try {
          await fetchGenerateStream({
            requirement, channel: ch, scenario, tone,
            onChunk: (text) => set((s) => ({ contents: { ...s.contents, [ch]: text } })),
          });
          set((s) => ({ statuses: { ...s.statuses, [ch]: "done" } }));
        } catch (e) {
          console.error(`[genText ${ch}]`, e);
          set((s) => ({ statuses: { ...s.statuses, [ch]: "error" } }));
        }
      })
    );

    const imageTasks = CHANNEL_IDS.map(async (ch) => {
      const url = await fetchGenerateImage({
        prompt: requirement,
        aspect: CHANNELS[ch].imageAspect,
      });
      if (url) set((s) => ({ images: { ...s.images, [ch]: [url] } }));
    });

    await Promise.allSettled([...textTasks, ...imageTasks]);
    set({ isGenerating: false });

    const finalContents = get().contents;
    const filled = CHANNEL_IDS.filter((ch) => finalContents[ch].length > 0);
    if (filled.length > 0) {
      useHistoryStore.getState().addEntry({
        type: "generate",
        title: requirement.slice(0, 40),
        summary: `生成了 ${filled.length} 个渠道的文案`,
        data: { requirement, scenario, tone, contents: finalContents },
      });
    }
  },
}));
