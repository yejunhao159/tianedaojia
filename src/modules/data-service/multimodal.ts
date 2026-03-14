import { GoogleGenAI } from "@google/genai";
import type { CleanedRecord } from "./types";

let _genai: GoogleGenAI | null = null;

function getClient() {
  if (!_genai) {
    _genai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
      httpOptions: {
        baseUrl: process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com",
      },
    });
  }
  return _genai;
}

const EXTRACT_PROMPT = `你是一个数据提取专家。请从以下内容中提取所有结构化信息。
返回 JSON 数组格式，每条记录包含：
- fields: 提取到的键值对
- confidence: 0-1 的置信度

只返回 JSON，不要其他文字。`;

export async function extractFromImage(
  base64Data: string,
  mimeType = "image/png",
  customPrompt?: string,
): Promise<CleanedRecord[]> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      { text: customPrompt ?? EXTRACT_PROMPT },
      { inlineData: { mimeType, data: base64Data } },
    ],
  });

  return parseAIResponse(response, "image");
}

export async function extractFromDocument(
  text: string,
  docType: "resume" | "certificate" | "contract" | "general" = "general",
): Promise<CleanedRecord[]> {
  const prompts: Record<string, string> = {
    resume: `请从以下简历/档案中提取：姓名、年龄、籍贯、技能、工作经验、期望薪资、联系方式。返回 JSON 数组。`,
    certificate: `请从以下证书信息中提取：证书名称、持有人、发证机构、有效期、等级。返回 JSON 数组。`,
    contract: `请从以下合同中提取：甲方、乙方、服务内容、薪资、起止日期、特殊条款。返回 JSON 数组。`,
    general: EXTRACT_PROMPT,
  };

  const ai = getClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${prompts[docType]}\n\n"""${text}"""`,
  });

  return parseAIResponse(response, "text");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseAIResponse(response: any, source: string): CleanedRecord[] {
  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) || text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    const arr = Array.isArray(parsed) ? parsed : [parsed];

    return arr.map((item: Record<string, unknown>, i: number) => ({
      id: `${source}-${i}`,
      fields: (item.fields ?? item) as Record<string, unknown>,
      confidence: (item.confidence as number) ?? 0.7,
      source: source as CleanedRecord["source"],
      warnings: [] as string[],
      rawSnippet: JSON.stringify(item).slice(0, 100),
    }));
  } catch {
    return [];
  }
}
