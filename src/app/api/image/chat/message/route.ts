import { sendChatMessage, getChat } from "@/lib/ai/image";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { IMAGE_MODEL } from "@/lib/ai/image";
import { z } from "zod/v4";

const schema = z.object({
  sessionId: z.string().min(1, "sessionId 不能为空"),
  prompt: z.string().min(1, "prompt 不能为空"),
  inputImageBase64: z.string().optional(),
  inputImageMimeType: z.string().optional(),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { sessionId, prompt, inputImageBase64, inputImageMimeType } = schema.parse(body);

    const session = getChat(sessionId);
    if (!session) {
      return Response.json({ error: "会话不存在或已过期，请创建新会话" }, { status: 404 });
    }

    const result = await sendChatMessage({
      sessionId,
      prompt,
      inputImageBase64,
      inputImageMimeType,
    });

    if (!result.success) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json({
      sessionId,
      imageUrl: result.imageUrl,
      mimeType: result.mimeType,
      text: result.text,
      messageCount: session.history.length,
    });
  },
  { route: "/api/image/chat/message", model: IMAGE_MODEL.id }
);
