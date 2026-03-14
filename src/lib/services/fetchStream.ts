export interface StreamOptions {
  url: string;
  body: Record<string, unknown>;
  onChunk: (accumulated: string) => void;
  signal?: AbortSignal;
}

export async function fetchStream(opts: StreamOptions): Promise<string> {
  const res = await fetch(opts.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts.body),
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

  return acc;
}

export function extractJSON<T>(text: string): T[] {
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [];
  }
}
