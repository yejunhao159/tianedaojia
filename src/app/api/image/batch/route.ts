import { createChat, sendChatMessage, deleteChat, IMAGE_MODEL } from "@modules/image-service";
import type { ImageTemplateId, ImageSize, ImageThinkingLevel } from "@modules/image-service";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";

const schema = z.object({
  prompt: z.string().min(1),
  aspect: z.string().default("1:1"),
  count: z.number().min(1).max(9).default(3),
  template: z.string().optional(),
  resolution: z.enum(["512", "1K", "2K"]).optional(),
  thinkingLevel: z.enum(["minimal", "high"]).optional(),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { prompt, aspect, count, template, resolution, thinkingLevel } = schema.parse(body);

    const session = createChat({
      aspect,
      resolution: (resolution ?? "1K") as ImageSize,
      template: (template ?? "recruit_warm") as ImageTemplateId,
      thinkingLevel: (thinkingLevel ?? "high") as ImageThinkingLevel,
    });

    const images: string[] = [];
    const sceneVariations = [
      `${prompt}。第一张图：整体场景展示，温馨明亮，展示工作环境全貌。`,
      `${prompt}。第二张图：工作细节特写，展示专业技能和认真态度。保持与第一张图相同的色调和风格。`,
      `${prompt}。第三张图：人物互动场景，展示服务过程中的温暖瞬间。保持与前两张图一致的视觉风格。`,
      `${prompt}。第四张图：换一个角度展示服务场景，突出环境的整洁和舒适感。`,
      `${prompt}。第五张图：收尾场景，展示服务完成后的满意效果。`,
      `${prompt}。第六张图：近景特写，展示服务用到的工具或食材。`,
      `${prompt}。第七张图：日常生活场景，自然轻松的氛围。`,
      `${prompt}。第八张图：另一个服务场景的变化。`,
      `${prompt}。第九张图：总结性的温馨画面。`,
    ];

    for (let i = 0; i < count; i++) {
      const scenePrompt = sceneVariations[i] ?? `${prompt}。第${i + 1}张图：延续前面的风格，展示不同角度。`;

      const result = await sendChatMessage({
        sessionId: session.id,
        prompt: scenePrompt,
      });

      if (result.success && result.imageUrl) {
        images.push(result.imageUrl);
      }
    }

    deleteChat(session.id);

    return Response.json({
      images,
      count: images.length,
      aspect,
      template: template ?? "recruit_warm",
    });
  },
  { route: "/api/image/batch", model: IMAGE_MODEL.id }
);
