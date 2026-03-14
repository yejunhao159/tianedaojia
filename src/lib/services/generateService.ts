import type { ChannelId, ScenarioId, ToneId } from "@/types";

export async function fetchGenerateStream(opts: {
  requirement: string;
  channel: ChannelId;
  scenario: ScenarioId;
  tone: ToneId;
  onChunk: (text: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requirement: opts.requirement,
      scenario: opts.scenario,
      tone: opts.tone,
      channel: opts.channel,
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

  return acc;
}

export async function fetchGenerateImage(opts: {
  prompt: string;
  aspect: string;
}): Promise<string | null> {
  try {
    const res = await fetch("/api/image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.imageUrl ?? null;
  } catch {
    return null;
  }
}
