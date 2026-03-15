import { createMediaFile, extractAndEmbed } from "@modules/multimodal-service";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";

const schema = z.object({
  base64Data: z.string().min(1, "文件数据不能为空"),
  mimeType: z.string().min(1, "MIME 类型不能为空"),
  fileName: z.string().default("upload"),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { base64Data, mimeType, fileName } = schema.parse(body);

    const file = createMediaFile({
      name: fileName,
      mimeType,
      size: Math.round(base64Data.length * 0.75),
      base64Data,
    });

    const result = await extractAndEmbed(file);

    return Response.json({
      success: result.success,
      mediaId: result.mediaId,
      type: result.type,
      text: result.text,
      structuredData: result.structuredData,
      confidence: result.confidence,
      hasVector: !!result.vector,
      durationMs: result.durationMs,
      error: result.error,
    });
  },
  { route: "/api/multimodal/extract", model: "gemini-2.5-flash" }
);
