export type LogLevel = "debug" | "info" | "warn" | "error";

export interface AICallLog {
  id: string;
  timestamp: number;
  level: LogLevel;
  route: string;
  model: string;
  durationMs: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  success: boolean;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface LogStore {
  add: (log: AICallLog) => void;
  getAll: () => AICallLog[];
  clear: () => void;
}
