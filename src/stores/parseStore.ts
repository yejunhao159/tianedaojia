import { create } from "zustand";
import { fetchParseStream } from "@/lib/services/parseService";
import { useHistoryStore } from "./historyStore";
import type { AuntieProfile, InfoSourceType } from "@/types";

interface ParseState {
  source: InfoSourceType;
  rawText: string;
  parsing: boolean;
  aiOutput: string;
  profiles: AuntieProfile[];

  setSource: (v: InfoSourceType) => void;
  setRawText: (v: string) => void;
  parse: () => Promise<void>;
}

export const useParseStore = create<ParseState>((set, get) => ({
  source: "wechat",
  rawText: "",
  parsing: false,
  aiOutput: "",
  profiles: [],

  setSource: (v) => set({ source: v }),
  setRawText: (v) => set({ rawText: v }),

  parse: async () => {
    const { rawText } = get();
    if (!rawText.trim()) return;

    set({ parsing: true, aiOutput: "", profiles: [] });

    try {
      const result = await fetchParseStream({
        rawText,
        onChunk: (text) => set({ aiOutput: text }),
      });
      set({ profiles: result.profiles });

      if (result.profiles.length > 0) {
        useHistoryStore.getState().addEntry({
          type: "parse",
          title: result.profiles.map((p) => p.name).join("、").slice(0, 40),
          summary: `解析出 ${result.profiles.length} 份阿姨档案`,
          data: { rawText, profiles: result.profiles },
        });
      }
    } catch (e) {
      console.error("Parse failed:", e);
    } finally {
      set({ parsing: false });
    }
  },
}));
