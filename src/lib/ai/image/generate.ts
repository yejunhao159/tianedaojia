import { getImageClient } from "./client";
import { clampResolution, normalizeAspect, DEFAULT_IMAGE_MODEL, type ImageModelId, type ImageSize } from "./models";
import { IMAGE_TEMPLATES, type ImageTemplateId } from "./templates";

export interface ImageResult {
  success: boolean;
  imageBase64?: string;
  mimeType?: string;
  imageUrl?: string;
  text?: string;
  error?: string;
  model?: ImageModelId;
  resolution?: ImageSize;
  template?: ImageTemplateId;
}

export interface GenerateImageOptions {
  prompt: string;
  aspect?: string;
  model?: ImageModelId;
  resolution?: ImageSize;
  template?: ImageTemplateId;
  customSystemInstruction?: string;
}

export async function generateImage(opts: GenerateImageOptions): Promise<ImageResult> {
  const model = opts.model ?? DEFAULT_IMAGE_MODEL;
  const resolution = clampResolution(opts.resolution ?? "1K", model);
  const aspect = normalizeAspect(opts.aspect ?? "1:1");

  const templateId = opts.template ?? "recruit_warm";
  const tpl = IMAGE_TEMPLATES[templateId];
  const systemInstruction = opts.customSystemInstruction ?? tpl?.systemInstruction ?? IMAGE_TEMPLATES.default.systemInstruction;

  try {
    const ai = getImageClient();
    const response = await ai.models.generateContent({
      model,
      contents: opts.prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        systemInstruction,
        imageConfig: { aspectRatio: aspect, imageSize: resolution },
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts?.length) {
      return { success: false, error: "Empty response from model" };
    }

    let text: string | undefined;
    let imageBase64: string | undefined;
    let mimeType: string | undefined;

    for (const part of parts) {
      if (part.thought) continue;
      if (part.text) text = part.text;
      else if (part.inlineData) {
        imageBase64 = part.inlineData.data;
        mimeType = part.inlineData.mimeType;
      }
    }

    if (imageBase64) {
      return {
        success: true,
        imageBase64,
        mimeType: mimeType || "image/png",
        imageUrl: `data:${mimeType || "image/png"};base64,${imageBase64}`,
        text,
        model,
        resolution,
        template: templateId,
      };
    }

    return { success: false, error: "No image in response", text };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[ImageService] Generation failed:", msg);
    return { success: false, error: msg };
  }
}
