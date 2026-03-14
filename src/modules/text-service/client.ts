import { createAnthropic } from "@ai-sdk/anthropic";
import type { TextModelId, TaskType, TaskParams } from "./types";

let _client: ReturnType<typeof createAnthropic> | null = null;

export function getLLMClient() {
  if (!_client) {
    _client = createAnthropic({
      apiKey: process.env.GEMINI_API_KEY!,
      baseURL: `${process.env.GEMINI_BASE_URL}/v1`,
    });
  }
  return _client;
}

export const TASK_DEFAULTS: Record<TaskType, TaskParams> = {
  generate: { model: "claude-sonnet-4-6-thinking", temperature: 0.8, maxOutputTokens: 2000 },
  parse:    { model: "claude-sonnet-4-6-thinking", temperature: 0.3, maxOutputTokens: 3000 },
  match:    { model: "claude-sonnet-4-6-thinking", temperature: 0.2, maxOutputTokens: 4000 },
  extract:  { model: "claude-sonnet-4-6-thinking", temperature: 0.1, maxOutputTokens: 2000 },
};

export function getModelForTask(task: TaskType, override?: TextModelId) {
  const modelId = override ?? TASK_DEFAULTS[task].model;
  return getLLMClient()(modelId);
}

export function getParamsForTask(task: TaskType): TaskParams {
  return TASK_DEFAULTS[task];
}
