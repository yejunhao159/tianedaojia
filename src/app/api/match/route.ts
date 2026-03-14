import { streamText } from "ai";
import { getAIClient, DEFAULT_MODEL } from "@/lib/ai/client";
import { MATCH_SYSTEM_PROMPT, buildMatchPrompt } from "@/lib/ai/prompts/match";
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

    const result = streamText({
      model: getAIClient()(DEFAULT_MODEL),
      system: MATCH_SYSTEM_PROMPT,
      prompt: buildMatchPrompt(requirement, candidates),
      maxOutputTokens: 3000,
      temperature: 0.3,
    });

    return result.toTextStreamResponse();
  },
  { route: "/api/match", model: DEFAULT_MODEL }
);
