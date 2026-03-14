import { createChat } from "@modules/image-service";
import type { CreateChatOptions, ImageTemplateId, ImageSize, ImageThinkingLevel } from "@modules/image-service";
import { z } from "zod/v4";

const schema = z.object({
  aspect: z.string().optional(),
  resolution: z.enum(["512", "1K", "2K"]).optional(),
  template: z.string().optional(),
  thinkingLevel: z.enum(["minimal", "high"]).optional(),
  customSystemInstruction: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.parse(body);

    const opts: CreateChatOptions = {
      aspect: parsed.aspect,
      resolution: parsed.resolution as ImageSize | undefined,
      template: parsed.template as ImageTemplateId | undefined,
      thinkingLevel: parsed.thinkingLevel as ImageThinkingLevel | undefined,
      customSystemInstruction: parsed.customSystemInstruction,
    };

    const session = createChat(opts);

    return Response.json({
      sessionId: session.id,
      config: session.config,
      createdAt: new Date(session.createdAt).toISOString(),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: msg }, { status: 400 });
  }
}
