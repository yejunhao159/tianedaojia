export type AgentRole = string;

export interface AgentConfig {
  id: string;
  name: string;
  role: AgentRole;
  systemPrompt: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  tools?: ToolDefinition[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute: (params: Record<string, unknown>) => Promise<unknown>;
}

export interface AgentMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  agentId?: string;
  toolName?: string;
  timestamp: number;
}

export interface AgentResult {
  agentId: string;
  success: boolean;
  output: string;
  toolCalls?: ToolCallResult[];
  metadata?: Record<string, unknown>;
  durationMs: number;
}

export interface ToolCallResult {
  toolName: string;
  input: Record<string, unknown>;
  output: unknown;
  durationMs: number;
}

export interface PipelineStep {
  agent: AgentConfig;
  inputTransform?: (prevOutput: string, context: PipelineContext) => string;
  shouldSkip?: (context: PipelineContext) => boolean;
  onComplete?: (result: AgentResult, context: PipelineContext) => void;
}

export interface PipelineContext {
  originalInput: string;
  stepResults: AgentResult[];
  metadata: Record<string, unknown>;
}

export interface PipelineResult {
  success: boolean;
  steps: AgentResult[];
  finalOutput: string;
  totalDurationMs: number;
}

export interface ConversationSession {
  id: string;
  agentId: string;
  messages: AgentMessage[];
  createdAt: number;
  lastActiveAt: number;
}
