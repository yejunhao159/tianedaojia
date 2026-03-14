import { fetchStream, extractJSON } from "./fetchStream";

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
  const rawOutput = await fetchStream({
    url: "/api/match",
    body: { requirement: opts.requirement, candidates: opts.candidates },
    onChunk: opts.onChunk,
    signal: opts.signal,
  });

  return { rawOutput, results: extractJSON<MatchResultItem>(rawOutput) };
}
