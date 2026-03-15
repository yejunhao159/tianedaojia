import {
  createPublishTask, executePublish, getAllTasks, getTask,
  registerAdapter, validateContent, CHANNELS,
  type ChannelId, type PublishAdapter,
} from "@modules/publish-service";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";

const CHANNEL_IDS = Object.keys(CHANNELS) as ChannelId[];
for (const id of CHANNEL_IDS) {
  const adapter: PublishAdapter = {
    channelId: id,
    validate: (content) => validateContent(id, content),
    publish: async (task) => {
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 1000));
      return {
        success: true,
        url: `https://${id}.example.com/post/${task.id.slice(0, 8)}`,
      };
    },
  };
  registerAdapter(adapter);
}

const createSchema = z.object({
  channelId: z.string().min(1),
  content: z.string().min(1, "文案不能为空"),
  imageUrls: z.array(z.string()).optional(),
});

const batchSchema = z.object({
  channels: z.array(z.object({
    channelId: z.string(),
    content: z.string(),
    imageUrls: z.array(z.string()).optional(),
  })),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();

    if (body.channels) {
      const { channels } = batchSchema.parse(body);
      const results = [];
      for (const ch of channels) {
        const task = createPublishTask(
          ch.channelId as ChannelId,
          ch.content,
          ch.imageUrls ?? [],
        );
        const result = await executePublish(task.id);
        results.push({
          channelId: ch.channelId,
          taskId: result.id,
          status: result.status,
          error: result.error,
          publishedAt: result.publishedAt,
          metadata: result.metadata,
        });
      }
      return Response.json({ results, total: results.length });
    }

    const { channelId, content, imageUrls } = createSchema.parse(body);
    const task = createPublishTask(channelId as ChannelId, content, imageUrls ?? []);
    const result = await executePublish(task.id);

    return Response.json({
      taskId: result.id,
      channelId: result.channelId,
      status: result.status,
      error: result.error,
      publishedAt: result.publishedAt,
      metadata: result.metadata,
    });
  },
  { route: "/api/publish", model: "publish-service" }
);

export async function GET() {
  const tasks = getAllTasks();
  return Response.json({
    total: tasks.length,
    tasks: tasks.slice(0, 50).map((t) => ({
      id: t.id,
      channelId: t.channelId,
      status: t.status,
      contentPreview: t.content.slice(0, 80),
      createdAt: t.createdAt,
      publishedAt: t.publishedAt,
      error: t.error,
    })),
  });
}
