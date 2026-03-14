import { create } from "zustand";
import { fetchMatchStream, type MatchResultItem } from "@/lib/services/matchService";
import { useHistoryStore } from "./historyStore";

const SAMPLE_REQ = "住家保姆 · 擅长川菜 · 朝阳区 · ¥6,000-8,000/月 · 有健康证";
const SAMPLE_CANDIDATES = `1. 王阿姨：48岁，四川人，4年经验，擅长川菜湘菜，有健康证和育婴师证，期望6500-7500/月，服务朝阳区
2. 刘阿姨：42岁，河南人，6年经验，擅长面食和收纳整理，有健康证，期望5500-6500/月，服务海淀/朝阳
3. 赵阿姨：45岁，安徽人，8年经验，擅长保洁收纳，期望5000-6000/月，朝阳区优先`;

interface MatchState {
  requirement: string;
  candidates: string;
  matching: boolean;
  results: MatchResultItem[];
  selectedIdx: number;
  aiOutput: string;
  weights: Record<string, number>;

  setRequirement: (v: string) => void;
  setCandidates: (v: string) => void;
  setSelectedIdx: (v: number) => void;
  setWeight: (key: string, value: number) => void;
  loadSample: () => void;
  match: () => Promise<void>;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  requirement: SAMPLE_REQ,
  candidates: SAMPLE_CANDIDATES,
  matching: false,
  results: [],
  selectedIdx: 0,
  aiOutput: "",
  weights: { district: 0.3, skill: 0.25, price: 0.2, experience: 0.15, time: 0.1 },

  setRequirement: (v) => set({ requirement: v }),
  setCandidates: (v) => set({ candidates: v }),
  setSelectedIdx: (v) => set({ selectedIdx: v }),
  setWeight: (key, value) =>
    set((s) => ({ weights: { ...s.weights, [key]: value } })),
  loadSample: () =>
    set({ candidates: SAMPLE_CANDIDATES }),

  match: async () => {
    const { requirement, candidates } = get();
    if (!requirement.trim() || !candidates.trim()) return;

    set({ matching: true, aiOutput: "", results: [], selectedIdx: 0 });

    try {
      const output = await fetchMatchStream({
        requirement,
        candidates,
        onChunk: (text) => set({ aiOutput: text }),
      });
      set({ results: output.results });

      if (output.results.length > 0) {
        useHistoryStore.getState().addEntry({
          type: "match",
          title: requirement.slice(0, 40),
          summary: `匹配了 ${output.results.length} 位候选人`,
          data: { requirement, candidates, results: output.results },
        });
      }
    } catch (e) {
      console.error("Match failed:", e);
    } finally {
      set({ matching: false });
    }
  },
}));
