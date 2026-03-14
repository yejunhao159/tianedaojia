import type { ChannelId } from "./types";

export type PublishStatus = "draft" | "scheduled" | "publishing" | "published" | "failed";

export interface PublishTask {
  id: string;
  channelId: ChannelId;
  content: string;
  imageUrls: string[];
  status: PublishStatus;
  scheduledAt?: number;
  createdAt: number;
  publishedAt?: number;
  retryCount: number;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface PublishAdapter {
  channelId: ChannelId;
  publish: (task: PublishTask) => Promise<{ success: boolean; url?: string; error?: string }>;
  validate: (content: string) => { valid: boolean; errors: string[] };
}

const adapters = new Map<ChannelId, PublishAdapter>();
const tasks = new Map<string, PublishTask>();

export function registerAdapter(adapter: PublishAdapter) {
  adapters.set(adapter.channelId, adapter);
}

export function getAdapter(channelId: ChannelId): PublishAdapter | undefined {
  return adapters.get(channelId);
}

export function createPublishTask(
  channelId: ChannelId,
  content: string,
  imageUrls: string[] = [],
  scheduledAt?: number,
): PublishTask {
  const task: PublishTask = {
    id: crypto.randomUUID(),
    channelId,
    content,
    imageUrls,
    status: scheduledAt ? "scheduled" : "draft",
    scheduledAt,
    createdAt: Date.now(),
    retryCount: 0,
  };
  tasks.set(task.id, task);
  return task;
}

export function getTask(id: string): PublishTask | undefined {
  return tasks.get(id);
}

export function getAllTasks(): PublishTask[] {
  return [...tasks.values()].sort((a, b) => b.createdAt - a.createdAt);
}

export async function executePublish(taskId: string): Promise<PublishTask> {
  const task = tasks.get(taskId);
  if (!task) throw new Error(`Task ${taskId} not found`);

  const adapter = adapters.get(task.channelId);
  if (!adapter) {
    task.status = "failed";
    task.error = `No adapter registered for channel: ${task.channelId}`;
    return task;
  }

  const validation = adapter.validate(task.content);
  if (!validation.valid) {
    task.status = "failed";
    task.error = `Validation failed: ${validation.errors.join(", ")}`;
    return task;
  }

  task.status = "publishing";

  try {
    const result = await adapter.publish(task);
    if (result.success) {
      task.status = "published";
      task.publishedAt = Date.now();
      task.metadata = { ...task.metadata, publishUrl: result.url };
    } else {
      task.status = "failed";
      task.error = result.error;
      task.retryCount++;
    }
  } catch (e: unknown) {
    task.status = "failed";
    task.error = e instanceof Error ? e.message : "Unknown publish error";
    task.retryCount++;
  }

  return task;
}

export async function batchPublish(channelIds: ChannelId[], content: string, imageUrls: string[] = []) {
  const results: PublishTask[] = [];

  for (const channelId of channelIds) {
    const task = createPublishTask(channelId, content, imageUrls);
    const result = await executePublish(task.id);
    results.push(result);
  }

  return results;
}
