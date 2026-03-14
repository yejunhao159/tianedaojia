export { getImageClient } from "./client";
export { IMAGE_MODEL, clampResolution, normalizeAspect } from "./models";
export { IMAGE_TEMPLATES, getImageTemplate } from "./templates";
export { generateImage, createChat, getChat, deleteChat, sendChatMessage } from "./generate";

export type {
  ImageModelId, ImageModelConfig, ImageSize, ImageThinkingLevel, AspectRatio,
  ImageTemplate, ImageResult, GenerateImageOptions,
  ChatSession, CreateChatOptions, ChatSendOptions,
} from "./types";
export type { ImageTemplateId } from "./templates";
