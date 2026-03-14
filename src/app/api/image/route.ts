import { generateImage, IMAGE_TEMPLATES, IMAGE_MODEL, type ImageTemplateId, type ImageSize, type ImageThinkingLevel } from "@/lib/ai/image";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";

const schema = z.object({
  prompt: z.string().min(1, "提示词不能为空"),
  aspect: z.enum(["1:1", "3:4", "4:3", "9:16", "16:9"]).default("1:1"),
  template: z.string().optional(),
  resolution: z.enum(["512", "1K", "2K"]).optional(),
  thinkingLevel: z.enum(["minimal", "high"]).optional(),
  customSystemInstruction: z.string().optional(),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { prompt, aspect, template, resolution, thinkingLevel, customSystemInstruction } = schema.parse(body);

    const result = await generateImage({
      prompt,
      aspect,
      template: template as ImageTemplateId | undefined,
      resolution: resolution as ImageSize | undefined,
      thinkingLevel: thinkingLevel as ImageThinkingLevel | undefined,
      customSystemInstruction,
    });

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json({
      imageUrl: result.imageUrl,
      mimeType: result.mimeType,
      text: result.text,
      resolution: result.resolution,
      template: result.template,
    });
  },
  { route: "/api/image", model: IMAGE_MODEL.id }
);

export async function GET() {
  const templates = Object.values(IMAGE_TEMPLATES).map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    preview: t.systemInstruction.slice(0, 120) + "...",
  }));

  return Response.json({
    model: {
      id: IMAGE_MODEL.id,
      name: IMAGE_MODEL.name,
      maxResolution: IMAGE_MODEL.maxResolution,
      maxInputImages: IMAGE_MODEL.maxInputImages,
      supportedAspects: IMAGE_MODEL.supportedAspects,
    },
    templates,
  });
}
