import { streamParseContent, TASK_DEFAULTS } from "@modules/text-service";
import { runPipeline as cleanData } from "@modules/data-service";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";

const schema = z.object({
  rawText: z.string().min(1, "原始文本不能为空"),
  source: z.enum(["text", "wechat_chat"]).default("text"),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { rawText, source } = schema.parse(body);

    const cleaned = cleanData({ source, content: rawText });
    const cleanedText = cleaned.records.map((r) => {
      if (r.fields.sender && r.fields.content) {
        return `${r.fields.sender}: ${r.fields.content}`;
      }
      return String(r.fields.raw ?? JSON.stringify(r.fields));
    }).join("\n");

    const textToProcess = cleanedText || rawText;

    const result = streamParseContent(textToProcess);
    return result.toTextStreamResponse();
  },
  { route: "/api/parse", model: TASK_DEFAULTS.parse.model }
);
