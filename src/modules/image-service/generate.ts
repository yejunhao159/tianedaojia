import { getImageClient } from "./client";
import { IMAGE_MODEL, clampResolution, normalizeAspect } from "./models";
import { IMAGE_TEMPLATES, type ImageTemplateId } from "./templates";
import type {
  ImageSize,
  ImageResult,
  GenerateImageOptions,
  ChatSession,
  ChatMessage,
  ChatPart,
  CreateChatOptions,
  ChatSendOptions,
} from "./types";

// ==================== 单次生成 ====================

export async function generateImage(opts: GenerateImageOptions): Promise<ImageResult> {
  const resolution = clampResolution(opts.resolution ?? "1K");
  const aspect = normalizeAspect(opts.aspect ?? "1:1");
  const thinkingLevel = opts.thinkingLevel ?? "high";

  const templateId = (opts.template ?? "recruit_warm") as ImageTemplateId;
  const tpl = IMAGE_TEMPLATES[templateId];
  const systemInstruction = opts.customSystemInstruction ?? tpl?.systemInstruction ?? IMAGE_TEMPLATES.default.systemInstruction;

  try {
    const ai = getImageClient();
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL.id,
      contents: opts.prompt,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        systemInstruction,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        thinkingConfig: { thinkingLevel: thinkingLevel as any },
        imageConfig: { aspectRatio: aspect, imageSize: resolution },
      },
    });

    return parseImageResponse(response, { resolution, template: templateId });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[ImageService] Generation failed:", msg);
    return { success: false, error: msg };
  }
}

// ==================== 多轮对话编辑 ====================

const sessions = new Map<string, ChatSession>();
const SESSION_TTL = 30 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [id, s] of sessions) {
    if (now - s.lastActiveAt > SESSION_TTL) sessions.delete(id);
  }
}, 5 * 60 * 1000);

export function createChat(opts: CreateChatOptions = {}): ChatSession {
  const id = crypto.randomUUID();
  const templateId = (opts.template ?? "default") as ImageTemplateId;
  const tpl = IMAGE_TEMPLATES[templateId];

  const session: ChatSession = {
    id,
    history: [],
    config: {
      aspect: normalizeAspect(opts.aspect ?? "1:1"),
      resolution: clampResolution(opts.resolution ?? "1K"),
      systemInstruction: opts.customSystemInstruction ?? tpl?.systemInstruction ?? IMAGE_TEMPLATES.default.systemInstruction,
      thinkingLevel: opts.thinkingLevel ?? "high",
    },
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  };

  sessions.set(id, session);
  return session;
}

export function getChat(id: string): ChatSession | null {
  const s = sessions.get(id);
  if (s) s.lastActiveAt = Date.now();
  return s ?? null;
}

export function deleteChat(id: string): boolean {
  return sessions.delete(id);
}

export async function sendChatMessage(opts: ChatSendOptions): Promise<ImageResult> {
  const session = getChat(opts.sessionId);
  if (!session) return { success: false, error: "会话不存在或已过期" };

  const userParts: ChatPart[] = [];
  if (opts.inputImageBase64) {
    userParts.push({
      inlineData: {
        mimeType: opts.inputImageMimeType ?? "image/png",
        data: opts.inputImageBase64,
      },
    });
  }
  userParts.push({ text: opts.prompt });

  session.history.push({ role: "user", parts: userParts });

  try {
    const ai = getImageClient();
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL.id,
      contents: session.history,
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        systemInstruction: session.config.systemInstruction,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        thinkingConfig: { thinkingLevel: session.config.thinkingLevel as any },
        imageConfig: {
          aspectRatio: session.config.aspect,
          imageSize: session.config.resolution,
        },
      },
    });

    const rawParts = response.candidates?.[0]?.content?.parts ?? [];

    const modelParts: ChatPart[] = [];
    for (const part of rawParts) {
      const saved: ChatPart = {};
      if (part.text) saved.text = part.text;
      if (part.inlineData) {
        saved.inlineData = {
          mimeType: part.inlineData.mimeType ?? "image/png",
          data: part.inlineData.data ?? "",
        };
      }
      if (part.thoughtSignature) saved.thoughtSignature = part.thoughtSignature;
      if (part.thought) saved.thought = part.thought;
      if (Object.keys(saved).length > 0) modelParts.push(saved);
    }
    session.history.push({ role: "model", parts: modelParts });

    return parseImageResponse(response, {
      resolution: session.config.resolution,
    });
  } catch (e: unknown) {
    session.history.pop();
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[ImageChat] Message failed:", msg);
    return { success: false, error: msg };
  }
}

// ==================== 响应解析 ====================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseImageResponse(
  response: any,
  meta: { resolution?: ImageSize; template?: ImageTemplateId },
): ImageResult {
  const parts = response?.candidates?.[0]?.content?.parts;
  if (!parts?.length) return { success: false, error: "Empty response" };

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
      resolution: meta.resolution,
      template: meta.template,
    };
  }

  return { success: false, error: "No image in response", text };
}
