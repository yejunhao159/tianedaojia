import type { CleanedRecord, CleaningStep } from "./types";

export const normalizeWhitespace: CleaningStep = {
  id: "normalize-ws",
  name: "规范化空白字符",
  type: "normalize",
  execute: (records) =>
    records.map((r) => ({
      ...r,
      fields: Object.fromEntries(
        Object.entries(r.fields).map(([k, v]) => [
          k,
          typeof v === "string" ? v.replace(/\s+/g, " ").trim() : v,
        ])
      ),
    })),
};

export const deduplicateByContent: CleaningStep = {
  id: "dedup-content",
  name: "内容去重",
  type: "deduplicate",
  execute: (records) => {
    const seen = new Set<string>();
    return records.filter((r) => {
      const key = JSON.stringify(r.fields);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },
};

export const filterEmpty: CleaningStep = {
  id: "filter-empty",
  name: "过滤空记录",
  type: "validate",
  execute: (records) =>
    records.filter((r) => {
      const values = Object.values(r.fields);
      return values.some((v) => v !== "" && v !== null && v !== undefined);
    }),
};

export const DEFAULT_PIPELINE: CleaningStep[] = [
  normalizeWhitespace,
  filterEmpty,
  deduplicateByContent,
];
