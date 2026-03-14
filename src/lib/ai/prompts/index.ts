import type { TaskType } from "../client";
import { generatePrompt } from "./generate";
import { parsePrompt } from "./parse";
import { matchPrompt } from "./match";

export interface PromptBuilder<TSystem = Record<string, unknown>, TUser = Record<string, unknown>> {
  id: TaskType;
  name: string;
  buildSystem: (vars?: TSystem) => string;
  buildUser: (vars: TUser) => string;
}

const PROMPT_REGISTRY: Record<TaskType, PromptBuilder<never, never>> = {
  generate: generatePrompt as unknown as PromptBuilder<never, never>,
  parse: parsePrompt as unknown as PromptBuilder<never, never>,
  match: matchPrompt as unknown as PromptBuilder<never, never>,
  extract: generatePrompt as unknown as PromptBuilder<never, never>,
};

export function getPrompt(task: TaskType): PromptBuilder<never, never> {
  return PROMPT_REGISTRY[task];
}

export { generatePrompt } from "./generate";
export { parsePrompt } from "./parse";
export { matchPrompt } from "./match";
