import type { TextModelConfig } from "./types";

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
