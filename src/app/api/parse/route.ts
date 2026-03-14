import { streamText } from "ai";
import { getAIClient, DEFAULT_MODEL } from "@/lib/ai/client";
import { PARSE_SYSTEM_PROMPT, buildParsePrompt } from "@/lib/ai/prompts/parse";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";

const schema = z.object({
  rawText: z.string().min(1, "原始文本不能为空"),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { rawText } = schema.parse(body);

    const result = streamText({
      model: getAIClient()(DEFAULT_MODEL),
      system: PARSE_SYSTEM_PROMPT,
      prompt: buildParsePrompt(rawText),
      maxOutputTokens: 3000,
      temperature: 0.3,
    });

    return result.toTextStreamResponse();
  },
  { route: "/api/parse", model: DEFAULT_MODEL }
);
