export { getImageClient } from "./client";
export { IMAGE_MODELS, clampResolution, normalizeAspect, DEFAULT_IMAGE_MODEL } from "./models";
export { IMAGE_TEMPLATES, getImageTemplate } from "./templates";
export { generateImage } from "./generate";

export type { ImageModelId, ImageModelConfig, ImageSize, AspectRatio } from "./models";
export type { ImageTemplateId, ImageTemplate } from "./templates";
export type { ImageResult, GenerateImageOptions } from "./generate";
