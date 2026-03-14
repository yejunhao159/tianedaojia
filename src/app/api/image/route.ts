import { generateRecruitImage, IMAGE_TEMPLATES, IMAGE_MODELS, type ImageTemplateId, type ImageModelId, type ImageSize } from "@/lib/ai/imageService";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";

const schema = z.object({
  prompt: z.string().min(1, "提示词不能为空"),
  aspect: z.enum(["1:1", "3:4", "4:3", "9:16", "16:9"]).default("1:1"),
  template: z.string().optional(),
  model: z.string().optional(),
  resolution: z.enum(["1K", "2K", "4K"]).optional(),
  customSystemInstruction: z.string().optional(),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { prompt, aspect, template, model, resolution, customSystemInstruction } = schema.parse(body);

    const result = await generateRecruitImage({
      prompt,
      aspect,
      template: template as ImageTemplateId | undefined,
      model: model as ImageModelId | undefined,
      resolution: resolution as ImageSize | undefined,
      customSystemInstruction,
    });

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json({
      imageUrl: result.imageUrl,
      mimeType: result.mimeType,
      text: result.text,
      model: result.model,
      resolution: result.resolution,
      template: result.template,
    });
  },
  { route: "/api/image", model: "gemini-image" }
);

export async function GET() {
  const templates = Object.values(IMAGE_TEMPLATES).map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    preview: t.systemInstruction.slice(0, 120) + "...",
  }));

  const models = Object.values(IMAGE_MODELS).map((m) => ({
    id: m.id,
    name: m.name,
    tier: m.tier,
    maxResolution: m.maxResolution,
    supportsThinking: m.supportsThinking,
  }));

  return Response.json({ templates, models });
}
