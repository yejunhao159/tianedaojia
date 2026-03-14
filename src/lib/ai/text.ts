import { streamText } from "ai";
import { getModelForTask, getParamsForTask } from "./client";
import { generatePrompt } from "./prompts/generate";
import { parsePrompt } from "./prompts/parse";
import { matchPrompt } from "./prompts/match";
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
    system: generatePrompt.buildSystem({ channel: opts.channel, tone: opts.tone, scenario: opts.scenario }),
    prompt: generatePrompt.buildUser({ requirement: opts.requirement }),
    temperature: params.temperature,
    maxOutputTokens: params.maxOutputTokens,
  });
}

export function streamParseContent(rawText: string) {
  const params = getParamsForTask("parse");
  return streamText({
    model: getModelForTask("parse"),
    system: parsePrompt.buildSystem(),
    prompt: parsePrompt.buildUser({ rawText }),
    temperature: params.temperature,
    maxOutputTokens: params.maxOutputTokens,
  });
}

export function streamMatchContent(requirement: string, candidates: string) {
  const params = getParamsForTask("match");
  return streamText({
    model: getModelForTask("match"),
    system: matchPrompt.buildSystem(),
    prompt: matchPrompt.buildUser({ requirement, candidates }),
    temperature: params.temperature,
    maxOutputTokens: params.maxOutputTokens,
  });
}
