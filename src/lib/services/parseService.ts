import type { AuntieProfile } from "@/types";

export interface ParseResult {
  rawOutput: string;
  profiles: AuntieProfile[];
}

export async function fetchParseStream(opts: {
  rawText: string;
  onChunk: (text: string) => void;
  signal?: AbortSignal;
}): Promise<ParseResult> {
  const res = await fetch("/api/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawText: opts.rawText }),
    signal: opts.signal,
  });

  if (!res.ok) throw new Error(`API ${res.status}`);

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let acc = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    acc += decoder.decode(value, { stream: true });
    opts.onChunk(acc);
  }

  const profiles = extractProfiles(acc);
  return { rawOutput: acc, profiles };
}

function extractProfiles(text: string): AuntieProfile[] {
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    return arr.map((p: AuntieProfile, i: number) => ({ ...p, id: `p-${i}` }));
  } catch {
    return [];
  }
}
