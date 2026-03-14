import { streamText } from "ai";
import { getAIClient, DEFAULT_MODEL } from "./client";
import { buildSystemPrompt, buildUserPrompt } from "./prompts/generate";
import type { ChannelId, ScenarioId, ToneId } from "@/types";

export function streamGenerateContent(opts: {
  requirement: string;
  channel: ChannelId;
  scenario: ScenarioId;
  tone: ToneId;
}) {
  return streamText({
    model: getAIClient()(DEFAULT_MODEL),
    system: buildSystemPrompt(opts.channel, opts.tone, opts.scenario),
    prompt: buildUserPrompt(opts.requirement),
    maxOutputTokens: 2000,
  });
}
