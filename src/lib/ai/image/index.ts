export { getImageClient } from "./client";
export { IMAGE_MODEL, clampResolution, normalizeAspect } from "./models";
export { IMAGE_TEMPLATES, getImageTemplate } from "./templates";
export { generateImage, createChat, getChat, deleteChat, sendChatMessage } from "./generate";

export type { ImageModelConfig, ImageSize, ImageThinkingLevel, AspectRatio } from "./models";
export type { ImageTemplateId, ImageTemplate } from "./templates";
export type { ImageResult, GenerateImageOptions, ChatSession, CreateChatOptions, ChatSendOptions } from "./generate";
