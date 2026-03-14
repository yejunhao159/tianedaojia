import { create } from "zustand";
import { fetchMatchStream, type MatchResultItem } from "@/lib/services/matchService";
import { useHistoryStore } from "./historyStore";

export interface CandidateInfo {
  id: string;
  name: string;
  age: number;
  origin: string;
  experience: number;
  skills: string[];
  salary: string;
  district: string;
  certificates: string[];
}

export interface RequirementInfo {
  position: string;
  district: string;
  salaryRange: string;
  skills: string[];
  experience: string;
  extras: string;
}

const SAMPLE_REQUIREMENT: RequirementInfo = {
  position: "住家保姆",
  district: "朝阳区",
  salaryRange: "6000-8000",
  skills: ["川菜", "做饭", "照顾老人"],
  experience: "3年以上",
  extras: "有健康证，性格开朗",
};

const SAMPLE_CANDIDATES: CandidateInfo[] = [
  {
    id: "c1", name: "王阿姨", age: 48, origin: "四川", experience: 4,
    skills: ["川菜", "湘菜", "面食"], salary: "6500-7500/月", district: "朝阳区",
    certificates: ["健康证", "育婴师证"],
  },
  {
    id: "c2", name: "刘阿姨", age: 42, origin: "河南", experience: 6,
    skills: ["面食", "收纳整理"], salary: "5500-6500/月", district: "海淀/朝阳",
    certificates: ["健康证"],
  },
  {
    id: "c3", name: "赵阿姨", age: 45, origin: "安徽", experience: 8,
    skills: ["保洁", "收纳"], salary: "5000-6000/月", district: "朝阳区",
    certificates: [],
  },
];

function requirementToText(r: RequirementInfo): string {
  return `${r.position} · ${r.district} · ¥${r.salaryRange}/月 · 需要技能：${r.skills.join("、")} · ${r.experience}经验 · ${r.extras}`;
}

function candidatesToText(cs: CandidateInfo[]): string {
  return cs.map((c, i) =>
    `${i + 1}. ${c.name}：${c.age}岁，${c.origin}人，${c.experience}年经验，擅长${c.skills.join("、")}，` +
    `${c.certificates.length > 0 ? "持有" + c.certificates.join("和") + "，" : ""}` +
    `期望${c.salary}，服务${c.district}`
  ).join("\n");
}

interface MatchState {
  requirement: RequirementInfo;
  candidates: CandidateInfo[];
  matching: boolean;
  results: MatchResultItem[];
  selectedIdx: number;
  aiOutput: string;
  weights: Record<string, number>;

  updateRequirement: (patch: Partial<RequirementInfo>) => void;
  addCandidate: (c: CandidateInfo) => void;
  removeCandidate: (id: string) => void;
  updateCandidate: (id: string, patch: Partial<CandidateInfo>) => void;
  setSelectedIdx: (v: number) => void;
  setWeight: (key: string, value: number) => void;
  loadSample: () => void;
  match: () => Promise<void>;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  requirement: SAMPLE_REQUIREMENT,
  candidates: SAMPLE_CANDIDATES,
  matching: false,
  results: [],
  selectedIdx: 0,
  aiOutput: "",
  weights: { district: 0.3, skill: 0.25, price: 0.2, experience: 0.15, time: 0.1 },

  updateRequirement: (patch) =>
    set((s) => ({ requirement: { ...s.requirement, ...patch } })),

  addCandidate: (c) =>
    set((s) => ({ candidates: [...s.candidates, c] })),

  removeCandidate: (id) =>
    set((s) => ({ candidates: s.candidates.filter((c) => c.id !== id) })),

  updateCandidate: (id, patch) =>
    set((s) => ({
      candidates: s.candidates.map((c) => c.id === id ? { ...c, ...patch } : c),
    })),

  setSelectedIdx: (v) => set({ selectedIdx: v }),
  setWeight: (key, value) =>
    set((s) => ({ weights: { ...s.weights, [key]: value } })),
  loadSample: () =>
    set({ candidates: SAMPLE_CANDIDATES, requirement: SAMPLE_REQUIREMENT }),

  match: async () => {
    const { requirement, candidates } = get();
    const reqText = requirementToText(requirement);
    const candText = candidatesToText(candidates);
    if (!reqText.trim() || candidates.length === 0) return;

    set({ matching: true, aiOutput: "", results: [], selectedIdx: 0 });

    try {
      const output = await fetchMatchStream({
        requirement: reqText,
        candidates: candText,
        onChunk: (text) => set({ aiOutput: text }),
      });
      set({ results: output.results });

      if (output.results.length > 0) {
        useHistoryStore.getState().addEntry({
          type: "match",
          title: `${requirement.position} · ${requirement.district}`,
          summary: `匹配了 ${output.results.length} 位候选人`,
          data: { requirement: reqText, candidates: candText, results: output.results },
        });
      }
    } catch (e) {
      console.error("Match failed:", e);
    } finally {
      set({ matching: false });
    }
  },
}));
