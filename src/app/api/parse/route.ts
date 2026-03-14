import { streamParseContent, TASK_DEFAULTS } from "@modules/text-service";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";

const schema = z.object({
  rawText: z.string().min(1, "原始文本不能为空"),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { rawText } = schema.parse(body);

    const result = streamParseContent(rawText);
    return result.toTextStreamResponse();
  },
  { route: "/api/parse", model: TASK_DEFAULTS.parse.model }
);
