import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";
import type { TextModelId, TaskType, TaskParams } from "./types";

export type ProviderType = "anthropic" | "openai";

interface ProviderConfig {
  type: ProviderType;
  apiKey: string;
  baseURL?: string;
}

function resolveProviderConfig(): ProviderConfig {
  const providerType = (process.env.LLM_PROVIDER ?? "anthropic") as ProviderType;
  return {
    type: providerType,
    apiKey: process.env.LLM_API_KEY ?? process.env.GEMINI_API_KEY!,
    baseURL: process.env.LLM_BASE_URL ?? process.env.GEMINI_BASE_URL
      ? `${process.env.LLM_BASE_URL ?? process.env.GEMINI_BASE_URL}/v1`
      : undefined,
  };
}

type ProviderFactory = (modelId: string) => LanguageModel;

let _provider: ProviderFactory | null = null;

function getProvider(): ProviderFactory {
  if (!_provider) {
    const config = resolveProviderConfig();
    switch (config.type) {
      case "openai": {
        const client = createOpenAI({
          apiKey: config.apiKey,
          baseURL: config.baseURL,
        });
        _provider = (modelId: string) => client(modelId);
        break;
      }
      case "anthropic":
      default: {
        const client = createAnthropic({
          apiKey: config.apiKey,
          baseURL: config.baseURL,
        });
        _provider = (modelId: string) => client(modelId);
        break;
      }
    }
  }
  return _provider;
}

export function getLLMModel(modelId: string): LanguageModel {
  return getProvider()(modelId);
}

export const TASK_DEFAULTS: Record<TaskType, TaskParams> = {
  generate: { model: "claude-sonnet-4-6-thinking", temperature: 0.8, maxOutputTokens: 2000 },
  parse:    { model: "claude-sonnet-4-6-thinking", temperature: 0.3, maxOutputTokens: 3000 },
  match:    { model: "claude-sonnet-4-6-thinking", temperature: 0.2, maxOutputTokens: 4000 },
  extract:  { model: "claude-sonnet-4-6-thinking", temperature: 0.1, maxOutputTokens: 2000 },
};

export function getModelForTask(task: TaskType, override?: TextModelId): LanguageModel {
  const modelId = override ?? TASK_DEFAULTS[task].model;
  return getLLMModel(modelId);
}

export function getParamsForTask(task: TaskType): TaskParams {
  return TASK_DEFAULTS[task];
}
