export { getLLMClient, getModelForTask, getParamsForTask, TASK_DEFAULTS } from "./client";
export { TEXT_MODELS } from "./models";
export { streamGenerateContent, streamParseContent, streamMatchContent } from "./streams";
export { extractRecruitmentInfo, recruitmentSchema } from "./extract";
export { generatePrompt } from "./prompts/generate";
export { parsePrompt } from "./prompts/parse";
export { matchPrompt } from "./prompts/match";

export type { PromptBuilder } from "./prompts/engine";
export type {
  TextModelId, TextModelConfig, TaskType, TaskParams, ChannelInfo,
  InfoSourceType, RawInfoMessage, AuntieProfile,
  MatchRequirement, MatchDimension, MatchCandidate,
  GeneratedContent, GenerateRequest,
} from "./types";
export type { RecruitmentData } from "./extract";
