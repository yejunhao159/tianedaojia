import { fetchStream } from "./fetchStream";
import type { ChannelId, ScenarioId, ToneId } from "@/types";

export async function fetchGenerateStream(opts: {
  requirement: string;
  channel: ChannelId;
  scenario: ScenarioId;
  tone: ToneId;
  onChunk: (text: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  return fetchStream({
    url: "/api/generate",
    body: {
      requirement: opts.requirement,
      scenario: opts.scenario,
      tone: opts.tone,
      channel: opts.channel,
    },
    onChunk: opts.onChunk,
    signal: opts.signal,
  });
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
