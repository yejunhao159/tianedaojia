import { getMultimodalClient, MODELS } from "./client";
import type { MediaFile, ExtractionResult } from "./types";

const EXTRACTION_PROMPTS: Record<string, string> = {
  image: `你是一个信息提取专家。请从这张图片中提取所有可见的文字和关键信息。
如果是证书/证件，提取：证书名称、持有人、发证机构、有效期。
如果是简历/档案，提取：姓名、年龄、技能、经验。
如果是场景照片，描述场景内容。
用中文输出 JSON 格式。`,

  audio: `你是一个语音转写和分析专家。请将这段音频的内容完整转写为中文文字。
然后提取关键信息：
- 如果是电话录音，提取双方身份和讨论的要点
- 如果是语音消息，提取核心信息
用中文输出，先给出完整转写，再给出关键信息 JSON。`,

  video: `你是一个视频内容分析专家。请分析这段视频，提取以下信息：
- 视频中出现的人物和场景
- 视频中的文字/字幕内容
- 视频的主要内容概述
用中文输出。`,

  document: `你是一个文档信息提取专家。请从这个文档中提取所有关键信息，结构化输出。
如果是简历，提取：姓名、年龄、籍贯、工作经验、技能、联系方式。
如果是合同，提取：甲乙方、服务内容、金额、期限。
如果是证书，提取：证书名称、持有人、等级、有效期。
用中文输出 JSON 格式。`,
};

export async function extractFromMedia(file: MediaFile): Promise<ExtractionResult> {
  const start = Date.now();

  if (!file.base64Data) {
    return {
      success: false,
      mediaId: file.id,
      type: file.type,
      confidence: 0,
      error: "No file data provided",
      durationMs: Date.now() - start,
    };
  }

  const prompt = EXTRACTION_PROMPTS[file.type] ?? EXTRACTION_PROMPTS.image;
  const model = file.type === "audio" ? MODELS.audio : file.type === "video" ? MODELS.video : MODELS.vision;

  try {
    const ai = getMultimodalClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contents: any[] = [
      { text: prompt },
      { inlineData: { mimeType: file.mimeType, data: file.base64Data } },
    ];

    const response = await ai.models.generateContent({
      model,
      contents,
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let structuredData: Record<string, unknown> | undefined;
    try {
      const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        structuredData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      }
    } catch {
      // JSON parse failed, use raw text
    }

    return {
      success: true,
      mediaId: file.id,
      type: file.type,
      text,
      structuredData,
      confidence: structuredData ? 0.85 : 0.6,
      durationMs: Date.now() - start,
    };
  } catch (e: unknown) {
    return {
      success: false,
      mediaId: file.id,
      type: file.type,
      confidence: 0,
      error: e instanceof Error ? e.message : "Extraction failed",
      durationMs: Date.now() - start,
    };
  }
}

export async function extractAndEmbed(file: MediaFile): Promise<ExtractionResult & { vector?: number[] }> {
  const extraction = await extractFromMedia(file);

  if (extraction.success && extraction.text) {
    const { embedText, addToVectorStore } = await import("./embedding");
    const embResult = await embedText(extraction.text, file.id);

    if (embResult.success) {
      addToVectorStore({
        mediaId: file.id,
        vector: embResult.vector,
        text: extraction.text.slice(0, 500),
        metadata: {
          fileName: file.name,
          type: file.type,
          structuredData: extraction.structuredData,
        },
      });
      return { ...extraction, vector: embResult.vector };
    }
  }

  return extraction;
}
