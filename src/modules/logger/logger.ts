import type { AICallLog } from "./types";

const logs: AICallLog[] = [];
const MAX_LOGS = 500;

export function addLog(log: Omit<AICallLog, "id" | "timestamp">) {
  const entry: AICallLog = {
    ...log,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };

  logs.unshift(entry);
  if (logs.length > MAX_LOGS) logs.length = MAX_LOGS;

  const tokenInfo = log.totalTokens ? ` | tokens: ${log.totalTokens}` : "";
  const status = log.success ? "OK" : `ERROR: ${log.error}`;
  console.log(
    `[AI] ${log.route} | ${log.model} | ${log.durationMs}ms${tokenInfo} | ${status}`
  );

  return entry;
}

export function getLogs(): AICallLog[] {
  return [...logs];
}

export function getStats() {
  const total = logs.length;
  const successful = logs.filter((l) => l.success).length;
  const totalTokens = logs.reduce((sum, l) => sum + (l.totalTokens ?? 0), 0);
  const avgDuration = total > 0
    ? Math.round(logs.reduce((sum, l) => sum + l.durationMs, 0) / total)
    : 0;

  const byRoute = logs.reduce<Record<string, number>>((acc, l) => {
    acc[l.route] = (acc[l.route] ?? 0) + 1;
    return acc;
  }, {});

  return { total, successful, failed: total - successful, totalTokens, avgDuration, byRoute };
}
