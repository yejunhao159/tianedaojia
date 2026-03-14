import type { ChannelId } from "./types";

export type PublishStatus = "draft" | "publishing" | "published" | "failed";

export interface PublishTask {
  id: string;
  channelId: ChannelId;
  content: string;
  imageUrls: string[];
  status: PublishStatus;
  createdAt: number;
  publishedAt?: number;
  error?: string;
}

// Placeholder for future publishing logic
export function createPublishTask(channelId: ChannelId, content: string, imageUrls: string[] = []): PublishTask {
  return {
    id: crypto.randomUUID(),
    channelId,
    content,
    imageUrls,
    status: "draft",
    createdAt: Date.now(),
  };
}
