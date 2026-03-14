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

export type ModelId =
  | "claude-sonnet-4-6-thinking"
  | "claude-sonnet-4-6"
  | "gemini-2.5-flash"
  | "gemini-2.5-pro";

export interface ModelConfig {
  id: ModelId;
  name: string;
  description: string;
  maxOutputTokens: number;
  supportsThinking: boolean;
  costTier: "low" | "medium" | "high";
}

export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: "claude-sonnet-4-6-thinking",
    name: "Claude Sonnet 4.6 Thinking",
    description: "深度推理模型，适合复杂的结构化提取和匹配分析",
    maxOutputTokens: 8000,
    supportsThinking: true,
    costTier: "high",
  },
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4.6",
    description: "平衡型模型，适合大多数文案生成和解析任务",
    maxOutputTokens: 4000,
    supportsThinking: false,
    costTier: "medium",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "极速模型，适合批量生成和实时交互场景",
    maxOutputTokens: 4000,
    supportsThinking: false,
    costTier: "low",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "高质量模型，适合长文案和复杂推理",
    maxOutputTokens: 8000,
    supportsThinking: true,
    costTier: "high",
  },
];

export interface GenerationParams {
  model?: ModelId;
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
}

export const DEFAULT_PARAMS: Record<string, GenerationParams> = {
  generate: { model: "claude-sonnet-4-6-thinking", temperature: 0.8, maxOutputTokens: 2000 },
  parse: { model: "claude-sonnet-4-6-thinking", temperature: 0.3, maxOutputTokens: 3000 },
  match: { model: "claude-sonnet-4-6-thinking", temperature: 0.2, maxOutputTokens: 4000 },
  extract: { model: "claude-sonnet-4-6-thinking", temperature: 0.1, maxOutputTokens: 2000 },
};

export function getModelForTask(task: keyof typeof DEFAULT_PARAMS, override?: ModelId) {
  const modelId = override ?? DEFAULT_PARAMS[task].model ?? DEFAULT_MODEL;
  return getAIClient()(modelId);
}

export function getParamsForTask(task: keyof typeof DEFAULT_PARAMS) {
  return DEFAULT_PARAMS[task];
}
