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

const CHANNEL_IMAGE_TEMPLATE: Record<string, string> = {
  douyin: "socialMedia",
  moments: "lifestyle",
  "58city": "recruit_professional",
  xiaohongshu: "socialMedia",
  wechat: "recruit_professional",
  wechat_group: "recruit_warm",
};

const IMAGE_ANGLES = [
  "整体服务场景，温馨明亮的家庭环境",
  "工作细节特写，展示专业技能",
  "温暖的人物互动，传递信任感",
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

    // Phase 1: 文案生成（3并发）
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

    // Phase 2: 基于文案内容生成配图（6并发，每渠道3张）
    const finalContents = get().contents;

    const imageTasks = CHANNEL_IDS.flatMap((ch) => {
      const text = finalContents[ch];
      if (!text) return [];

      set((s) => ({ imageStatuses: { ...s.imageStatuses, [ch]: "generating" } }));
      const template = CHANNEL_IMAGE_TEMPLATE[ch] ?? "recruit_warm";
      const summary = text.replace(/[#@\n]/g, " ").slice(0, 150);

      return IMAGE_ANGLES.map((angle, i) =>
        imageLimit(async () => {
          try {
            const prompt = `为${CHANNELS[ch].name}平台的家政招聘文案配图。文案摘要：「${summary}」。画面要求：${angle}。中国家庭场景，不要文字水印。`;
            const url = await fetchGenerateImage({
              prompt,
              aspect: CHANNELS[ch].imageAspect,
              template,
            });
            if (url) {
              set((s) => {
                const current = s.images[ch] ?? [];
                return { images: { ...s.images, [ch]: [...current, url] } };
              });
            }
            if (i === IMAGE_ANGLES.length - 1) {
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

    await Promise.allSettled(imageTasks);
    set({ isGenerating: false });

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
