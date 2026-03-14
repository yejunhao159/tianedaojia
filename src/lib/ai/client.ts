import { createAnthropic } from "@ai-sdk/anthropic";

let _client: ReturnType<typeof createAnthropic> | null = null;

export function getAIClient() {
  if (!_client) {
    _client = createAnthropic({
      apiKey: process.env.GEMINI_API_KEY!,
      baseURL: `${process.env.GEMINI_BASE_URL}/v1`,
    });
  }
  return _client;
}

export const DEFAULT_MODEL = "claude-sonnet-4-6-thinking";
