import { create } from "zustand";
import pLimit from "p-limit";
import { CHANNEL_IDS, CHANNELS } from "@modules/publish-service";
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
  imageStatuses: Record<ChannelId, Status>;
  isGenerating: boolean;

  setRequirement: (v: string) => void;
  setScenario: (v: ScenarioId) => void;
  setTone: (v: ToneId) => void;
  updateContent: (ch: ChannelId, text: string) => void;
  batchGenerate: () => Promise<void>;
}

const empty = <T,>(val: T) =>
  Object.fromEntries(CHANNEL_IDS.map((id) => [id, val])) as Record<ChannelId, T>;

const textLimit = pLimit(3);
const imageLimit = pLimit(6);

const IMAGE_SCENE_PROMPTS = [
  "温馨的家政服务场景，阿姨在整洁明亮的厨房做饭，暖色调",
  "专业的家政服务人员在工作，认真细致的特写，干净利落",
  "家庭温暖的互动场景，阿姨和家人在客厅，自然光线，温馨氛围",
];

export const useGenerateStore = create<GenerateState>((set, get) => ({
  requirement: "",
  scenario: "nanny",
  tone: "friendly",
  contents: empty(""),
  statuses: empty<Status>("idle"),
  images: empty<string[]>([]),
  imageStatuses: empty<Status>("idle"),
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
      imageStatuses: empty<Status>("idle"),
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

    const imageTasks = CHANNEL_IDS.flatMap((ch) => {
      set((s) => ({ imageStatuses: { ...s.imageStatuses, [ch]: "generating" } }));
      return IMAGE_SCENE_PROMPTS.map((scene, i) =>
        imageLimit(async () => {
          try {
            const prompt = `${requirement}。${scene}`;
            const url = await fetchGenerateImage({
              prompt,
              aspect: CHANNELS[ch].imageAspect,
            });
            if (url) {
              set((s) => {
                const current = s.images[ch] ?? [];
                return { images: { ...s.images, [ch]: [...current, url] } };
              });
            }
            if (i === IMAGE_SCENE_PROMPTS.length - 1) {
              set((s) => ({
                imageStatuses: { ...s.imageStatuses, [ch]: (s.images[ch]?.length ?? 0) > 0 ? "done" : "error" },
              }));
            }
          } catch (e) {
            console.error(`[genImage ${ch}:${i}]`, e);
          }
        })
      );
    });

    await Promise.allSettled([...textTasks, ...imageTasks]);
    set({ isGenerating: false });

    const finalContents = get().contents;
    const filled = CHANNEL_IDS.filter((ch) => finalContents[ch].length > 0);
    if (filled.length > 0) {
      useHistoryStore.getState().addEntry({
        type: "generate",
        title: requirement.slice(0, 40),
        summary: `生成了 ${filled.length} 个渠道的文案和配图`,
        data: { requirement, scenario, tone, contents: finalContents },
      });
    }
  },
}));
