import { createAnthropic } from "@ai-sdk/anthropic";

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

export type TextModelId =
  | "claude-sonnet-4-6-thinking"
  | "claude-sonnet-4-6"
  | "gemini-2.5-flash"
  | "gemini-2.5-pro";

export interface TextModelConfig {
  id: TextModelId;
  name: string;
  description: string;
  maxOutputTokens: number;
  supportsThinking: boolean;
  costTier: "low" | "medium" | "high";
}

export const TEXT_MODELS: TextModelConfig[] = [
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

export type TaskType = "generate" | "parse" | "match" | "extract";

export interface TaskParams {
  model: TextModelId;
  temperature: number;
  maxOutputTokens: number;
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
