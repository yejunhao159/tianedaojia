export interface AICallLog {
  id: string;
  timestamp: number;
  route: string;
  model: string;
  durationMs: number;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  success: boolean;
  error?: string;
}
