import { generateRecruitImage } from "@/lib/ai/imageService";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";

const schema = z.object({
  prompt: z.string().min(1, "提示词不能为空"),
  aspect: z.enum(["1:1", "3:4", "4:3", "9:16", "16:9"]).default("1:1"),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { prompt, aspect } = schema.parse(body);

    const result = await generateRecruitImage({ prompt, aspect });

    if (!result.success || !result.imageUrl) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json({ imageUrl: result.imageUrl });
  },
  { route: "/api/image", model: "gemini-3.1-flash-image-preview" }
);
