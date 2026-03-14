export type ImageModelId =
  | "gemini-2.5-flash-image"
  | "gemini-3.1-flash-image-preview"
  | "gemini-3-pro-image-preview";

export type ImageSize = "1K" | "2K" | "4K";

export interface ImageModelConfig {
  id: ImageModelId;
  name: string;
  tier: "standard" | "enhanced" | "pro";
  maxInputImages: number;
  maxResolution: ImageSize;
  supportsThinking: boolean;
}

export const IMAGE_MODELS: Record<ImageModelId, ImageModelConfig> = {
  "gemini-2.5-flash-image": {
    id: "gemini-2.5-flash-image",
    name: "Gemini 2.5 Flash Image",
    tier: "standard",
    maxInputImages: 5,
    maxResolution: "1K",
    supportsThinking: false,
  },
  "gemini-3.1-flash-image-preview": {
    id: "gemini-3.1-flash-image-preview",
    name: "Gemini 3.1 Flash Image",
    tier: "enhanced",
    maxInputImages: 10,
    maxResolution: "2K",
    supportsThinking: false,
  },
  "gemini-3-pro-image-preview": {
    id: "gemini-3-pro-image-preview",
    name: "Gemini 3 Pro Image",
    tier: "pro",
    maxInputImages: 14,
    maxResolution: "4K",
    supportsThinking: true,
  },
};

const RESOLUTION_ORDER: ImageSize[] = ["1K", "2K", "4K"];

export function clampResolution(requested: ImageSize, model: ImageModelId): ImageSize {
  const max = IMAGE_MODELS[model]?.maxResolution ?? "1K";
  const reqIdx = RESOLUTION_ORDER.indexOf(requested);
  const maxIdx = RESOLUTION_ORDER.indexOf(max);
  if (reqIdx < 0) return max;
  return RESOLUTION_ORDER[Math.min(reqIdx, maxIdx)];
}

export const DEFAULT_IMAGE_MODEL: ImageModelId = "gemini-3.1-flash-image-preview";

const VALID_ASPECTS = ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"] as const;
export type AspectRatio = typeof VALID_ASPECTS[number];

export function normalizeAspect(aspect: string): AspectRatio {
  if (VALID_ASPECTS.includes(aspect as AspectRatio)) return aspect as AspectRatio;
  return "1:1";
}
