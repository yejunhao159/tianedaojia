import type { ImageModelConfig, ImageSize } from "./types";

export const IMAGE_MODEL: ImageModelConfig = {
  id: "gemini-3.1-flash-image-preview",
  name: "Gemini 3.1 Flash Image (Nano Banana 2)",
  maxInputImages: 10,
  maxResolution: "2K",
  supportedAspects: [
    "1:1", "1:4", "1:8", "2:3", "3:2", "3:4",
    "4:1", "4:3", "4:5", "5:4", "8:1", "9:16", "16:9", "21:9",
  ],
};

const VALID_ASPECTS = IMAGE_MODEL.supportedAspects;

export function normalizeAspect(aspect: string): string {
  if (VALID_ASPECTS.includes(aspect)) return aspect;
  return "1:1";
}

const RESOLUTION_ORDER: ImageSize[] = ["512", "1K", "2K"];

export function clampResolution(requested: ImageSize): ImageSize {
  const reqIdx = RESOLUTION_ORDER.indexOf(requested);
  const maxIdx = RESOLUTION_ORDER.indexOf(IMAGE_MODEL.maxResolution);
  if (reqIdx < 0) return "1K";
  return RESOLUTION_ORDER[Math.min(reqIdx, maxIdx)];
}
