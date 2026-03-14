import { streamMatchContent, TASK_DEFAULTS } from "@modules/text-service";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";

const schema = z.object({
  requirement: z.string().min(1, "需求不能为空"),
  candidates: z.string().min(1, "候选人信息不能为空"),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { requirement, candidates } = schema.parse(body);

    const result = streamMatchContent(requirement, candidates);
    return result.toTextStreamResponse();
  },
  { route: "/api/match", model: TASK_DEFAULTS.match.model }
);
