import { streamGenerateContent, TASK_DEFAULTS } from "@modules/text-service";
import { CHANNELS } from "@modules/publish-service";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";
import type { ChannelId } from "@modules/publish-service";

const schema = z.object({
  requirement: z.string().min(1, "需求不能为空"),
  channel: z.enum(["douyin", "moments", "58city", "xiaohongshu", "wechat"]),
  scenario: z.enum(["hourly", "nanny", "maternity", "cleaning"]).default("hourly"),
  tone: z.enum(["formal", "friendly", "social"]).default("formal"),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { requirement, channel, scenario, tone } = schema.parse(body);

    const ch = CHANNELS[channel as ChannelId];
    const result = streamGenerateContent({
      requirement,
      channelConfig: ch,
      scenario,
      tone,
    });
    return result.toTextStreamResponse();
  },
  { route: "/api/generate", model: TASK_DEFAULTS.generate.model }
);
