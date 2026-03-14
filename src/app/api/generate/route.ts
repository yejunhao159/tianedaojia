import { streamGenerateContent } from "@/lib/ai/claude";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { DEFAULT_MODEL } from "@/lib/ai/client";
import { z } from "zod/v4";

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

    const result = streamGenerateContent({ requirement, channel, scenario, tone });
    return result.toTextStreamResponse();
  },
  { route: "/api/generate", model: DEFAULT_MODEL }
);
