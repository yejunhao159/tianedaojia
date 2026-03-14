const API_KEY = process.env.GEMINI_API_KEY!;
const BASE_URL = process.env.GEMINI_BASE_URL || "https://hk-api.gptbest.vip";
const MODEL = "gemini-3.1-flash-image-preview";

const ASPECT_HINT: Record<string, string> = {
  "1:1": "正方形构图",
  "3:4": "竖版3:4构图",
  "4:3": "横版4:3构图",
  "9:16": "手机竖屏9:16构图",
  "16:9": "横版宽屏16:9构图",
};

export interface ImageResult {
  success: boolean;
  imageUrl?: string;
  text?: string;
  error?: string;
}

export async function generateRecruitImage(opts: {
  prompt: string;
  aspect: string;
}): Promise<ImageResult> {
  const hint = ASPECT_HINT[opts.aspect] || "正方形构图";
  const fullPrompt = `生成一张家政服务招聘配图，${hint}，温馨专业风格，明亮暖色调，中国家庭服务场景。主题：${opts.prompt}。画面干净，不要文字水印。`;

  try {
    const res = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "user", content: fullPrompt }],
      }),
      signal: AbortSignal.timeout(180000),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: `API ${res.status}: ${errBody.slice(0, 200)}` };
    }

    const json = await res.json();
    const content = json.choices?.[0]?.message?.content;

    if (!content) {
      return { success: false, error: "Empty response" };
    }

    // Response is markdown: ![image](https://...png)
    if (typeof content === "string") {
      const mdMatch = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
      if (mdMatch) {
        return { success: true, imageUrl: mdMatch[1], text: content };
      }
      const urlMatch = content.match(/https?:\/\/[^\s"'<>]+\.(png|jpg|jpeg|webp|gif)/i);
      if (urlMatch) {
        return { success: true, imageUrl: urlMatch[0], text: content };
      }
      return { success: false, error: "No image URL in response", text: content };
    }

    // Array content format
    if (Array.isArray(content)) {
      for (const part of content) {
        if (part.type === "image_url" && part.image_url?.url) {
          return { success: true, imageUrl: part.image_url.url };
        }
        if (part.type === "text" && typeof part.text === "string") {
          const mdMatch = part.text.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
          if (mdMatch) return { success: true, imageUrl: mdMatch[1], text: part.text };
        }
      }
    }

    return { success: false, error: "Unexpected format" };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("Image generation failed:", msg);
    return { success: false, error: msg };
  }
}
