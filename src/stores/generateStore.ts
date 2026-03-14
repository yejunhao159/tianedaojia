import { create } from "zustand";
import pLimit from "p-limit";
import { CHANNEL_IDS, CHANNELS } from "@modules/publish-service";
import { fetchGenerateStream, fetchBatchImages } from "@/lib/services/generateService";
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
  imageStatuses: Record<ChannelId, Status>;
  isGenerating: boolean;
  isGeneratingImages: boolean;

  setRequirement: (v: string) => void;
  setScenario: (v: ScenarioId) => void;
  setTone: (v: ToneId) => void;
  updateContent: (ch: ChannelId, text: string) => void;
  batchGenerate: () => Promise<void>;
  saveToRecruit: () => void;
}

const empty = <T,>(val: T) =>
  Object.fromEntries(CHANNEL_IDS.map((id) => [id, val])) as Record<ChannelId, T>;

const textLimit = pLimit(2);
const imageLimit = pLimit(5);

export const useGenerateStore = create<GenerateState>((set, get) => ({
  requirement: "",
  scenario: "nanny",
  tone: "friendly",
  contents: empty(""),
  statuses: empty<Status>("idle"),
  images: empty<string[]>([]),
  imageStatuses: empty<Status>("idle"),
  isGenerating: false,
  isGeneratingImages: false,

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
      isGeneratingImages: false,
      contents: empty(""),
      statuses: empty<Status>("idle"),
      images: empty<string[]>([]),
      imageStatuses: empty<Status>("idle"),
    });

    // Phase 1: 并发生成所有渠道的文案
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

    await Promise.allSettled(textTasks);
    set({ isGenerating: false, isGeneratingImages: true });

    // Phase 2: 文案完成后，根据文案内容生成配图
    const finalContents = get().contents;
    const imageTasks = CHANNEL_IDS.map((ch) =>
      imageLimit(async () => {
        const text = finalContents[ch];
        if (!text) return;

        set((s) => ({ imageStatuses: { ...s.imageStatuses, [ch]: "generating" } }));
        try {
          const imagePrompt = `根据以下${CHANNELS[ch].name}招聘文案生成配图：\n\n${text.slice(0, 300)}`;
          const urls = await fetchBatchImages({
            prompt: imagePrompt,
            aspect: CHANNELS[ch].imageAspect,
            count: 3,
          });
          set((s) => ({
            images: { ...s.images, [ch]: urls },
            imageStatuses: { ...s.imageStatuses, [ch]: urls.length > 0 ? "done" : "error" },
          }));
        } catch (e) {
          console.error(`[genImage ${ch}]`, e);
          set((s) => ({ imageStatuses: { ...s.imageStatuses, [ch]: "error" } }));
        }
      })
    );

    await Promise.allSettled(imageTasks);
    set({ isGeneratingImages: false });

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

  saveToRecruit: () => {},
}));
