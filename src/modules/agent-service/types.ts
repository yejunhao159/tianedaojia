export type AgentRole = string;

export interface AgentConfig {
  id: string;
  name: string;
  role: AgentRole;
  systemPrompt: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
  agentId?: string;
  timestamp: number;
}

export interface AgentResult {
  agentId: string;
  success: boolean;
  output: string;
  metadata?: Record<string, unknown>;
  durationMs: number;
}

export interface PipelineStep {
  agent: AgentConfig;
  inputTransform?: (prevOutput: string, context: PipelineContext) => string;
  shouldSkip?: (context: PipelineContext) => boolean;
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
