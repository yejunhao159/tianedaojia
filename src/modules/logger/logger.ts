import type { AICallLog, LogLevel, LogStore } from "./types";

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let minLevel: LogLevel = "info";
const stores: LogStore[] = [];

class MemoryStore implements LogStore {
  private logs: AICallLog[] = [];
  private maxSize: number;

  constructor(maxSize = 500) {
    this.maxSize = maxSize;
  }

  add(log: AICallLog) {
    this.logs.unshift(log);
    if (this.logs.length > this.maxSize) this.logs.length = this.maxSize;
  }

  getAll() {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }
}

const memoryStore = new MemoryStore();
stores.push(memoryStore);

export function setLogLevel(level: LogLevel) {
  minLevel = level;
}

export function addLogStore(store: LogStore) {
  stores.push(store);
}

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[minLevel];
}

export function addLog(
  log: Omit<AICallLog, "id" | "timestamp" | "level"> & { level?: LogLevel }
) {
  const level = log.level ?? (log.success ? "info" : "error");
  if (!shouldLog(level)) return null;

  const entry: AICallLog = {
    ...log,
    level,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  };

  for (const store of stores) {
    store.add(entry);
  }

  const tokenInfo = log.totalTokens ? ` | tokens: ${log.totalTokens}` : "";
  const status = log.success ? "OK" : `ERR: ${log.error}`;
  const prefix = `[AI:${level.toUpperCase()}]`;
  console.log(`${prefix} ${log.route} | ${log.model} | ${log.durationMs}ms${tokenInfo} | ${status}`);

  return entry;
}

export function getLogs(opts?: { level?: LogLevel; route?: string; limit?: number }): AICallLog[] {
  let result = memoryStore.getAll();

  if (opts?.level) {
    const minPriority = LOG_LEVEL_PRIORITY[opts.level];
    result = result.filter((l) => LOG_LEVEL_PRIORITY[l.level] >= minPriority);
  }
  if (opts?.route) {
    result = result.filter((l) => l.route === opts.route);
  }
  if (opts?.limit) {
    result = result.slice(0, opts.limit);
  }

  return result;
}

export function getStats() {
  const logs = memoryStore.getAll();
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

  const byLevel = logs.reduce<Record<string, number>>((acc, l) => {
    acc[l.level] = (acc[l.level] ?? 0) + 1;
    return acc;
  }, {});

  return { total, successful, failed: total - successful, totalTokens, avgDuration, byRoute, byLevel };
}
