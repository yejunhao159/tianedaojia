import { fetchStream, extractJSON } from "./fetchStream";
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
  const rawOutput = await fetchStream({
    url: "/api/parse",
    body: { rawText: opts.rawText },
    onChunk: opts.onChunk,
    signal: opts.signal,
  });

  const profiles = extractJSON<AuntieProfile>(rawOutput).map((p, i) => ({
    ...p,
    id: p.id || `p-${i}`,
  }));

  return { rawOutput, profiles };
}
