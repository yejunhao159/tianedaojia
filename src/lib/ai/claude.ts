import { streamText } from "ai";
import { getModelForTask, getParamsForTask } from "./client";
import { buildSystemPrompt, buildUserPrompt } from "./prompts/generate";
import type { ChannelId, ScenarioId, ToneId } from "@/types";

export function streamGenerateContent(opts: {
  requirement: string;
  channel: ChannelId;
  scenario: ScenarioId;
  tone: ToneId;
}) {
  const params = getParamsForTask("generate");
  return streamText({
    model: getModelForTask("generate"),
    system: buildSystemPrompt(opts.channel, opts.tone, opts.scenario),
    prompt: buildUserPrompt(opts.requirement),
    temperature: params.temperature,
    maxOutputTokens: params.maxOutputTokens,
  });
}
