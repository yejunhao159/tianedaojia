export interface MatchResultItem {
  name: string;
  totalScore: number;
  dimensions: Record<string, { score: number; reason: string }>;
  recommendation: string;
  advantages: string[];
  risks: string[];
}

export interface MatchOutput {
  rawOutput: string;
  results: MatchResultItem[];
}

export async function fetchMatchStream(opts: {
  requirement: string;
  candidates: string;
  onChunk: (text: string) => void;
  signal?: AbortSignal;
}): Promise<MatchOutput> {
  const res = await fetch("/api/match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requirement: opts.requirement,
      candidates: opts.candidates,
    }),
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

  const results = extractResults(acc);
  return { rawOutput: acc, results };
}

function extractResults(text: string): MatchResultItem[] {
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}
