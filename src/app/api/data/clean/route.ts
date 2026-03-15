import { runPipeline } from "@modules/data-service";
import type { RawDataInput } from "@modules/data-service";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";

const schema = z.object({
  content: z.string().min(1, "内容不能为空"),
  source: z.enum(["text", "wechat_chat", "excel", "image", "audio", "pdf"]).default("text"),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { content, source } = schema.parse(body);

    const input: RawDataInput = { source: source as RawDataInput["source"], content };
    const result = runPipeline(input);

    return Response.json({
      records: result.records,
      stats: result.stats,
    });
  },
  { route: "/api/data/clean", model: "data-pipeline" }
);
