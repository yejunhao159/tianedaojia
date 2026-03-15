import { streamText, generateText } from "ai";
import type { LanguageModel } from "ai";
import type { AgentConfig, AgentResult } from "./types";

export type ModelResolver = (modelId?: string) => LanguageModel;

let _resolver: ModelResolver | null = null;

export function setModelResolver(resolver: ModelResolver) {
  _resolver = resolver;
}

function getModel(modelId?: string): LanguageModel {
  if (!_resolver) throw new Error("Agent model resolver not set. Call setModelResolver() or initAgentServer() first.");
  return _resolver(modelId);
}

export function initFromTextService() {
  try {
    const { getLLMModel } = require("@modules/text-service");
    _resolver = (modelId?: string) => getLLMModel(modelId ?? "default");
  } catch {
    // text-service not available, must call setModelResolver manually
  }
}

export async function runAgent(
  agent: AgentConfig,
  userInput: string,
): Promise<AgentResult> {
  if (!_resolver) initFromTextService();

  const start = Date.now();

  try {
    const result = await generateText({
      model: getModel(agent.model),
      system: agent.systemPrompt,
      prompt: userInput,
      temperature: agent.temperature ?? 0.5,
      maxOutputTokens: agent.maxOutputTokens ?? 2000,
    });

    return {
      agentId: agent.id,
      success: true,
      output: result.text,
      durationMs: Date.now() - start,
    };
  } catch (e: unknown) {
    return {
      agentId: agent.id,
      success: false,
      output: "",
      metadata: { error: e instanceof Error ? e.message : "Unknown error" },
      durationMs: Date.now() - start,
    };
  }
}

export function streamAgent(agent: AgentConfig, userInput: string) {
  if (!_resolver) initFromTextService();

  return streamText({
    model: getModel(agent.model),
    system: agent.systemPrompt,
    prompt: userInput,
    temperature: agent.temperature ?? 0.5,
    maxOutputTokens: agent.maxOutputTokens ?? 2000,
  });
}
