import { z } from "zod";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import type { ScenarioId } from "@/types";

const anthropic = createAnthropic({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: `${process.env.GEMINI_BASE_URL}/v1`,
});

// 定义第一阶段抽取的结构化数据 Schema
export const recruitmentSchema = z.object({
  jobTitle: z.string().describe("岗位名称，例如：住家保姆、钟点工、月嫂等"),
  salary: z.string().describe("薪资待遇，例如：6000-8000/月，200/天，面议等"),
  location: z.string().describe("工作地点或区域，例如：朝阳区、望京等"),
  schedule: z.string().describe("工作时间或班次，例如：做六休一、每天下午2点到6点等"),
  requirements: z.array(z.string()).describe("技能或经验要求，例如：会川菜、带过新生儿、性格开朗等"),
  duties: z.array(z.string()).describe("主要工作内容，例如：做饭、打扫卫生、接送孩子等"),
  benefits: z.array(z.string()).describe("福利待遇，例如：包吃住、节日红包等"),
  specialNotes: z.string().optional().describe("其他特殊说明或备注信息"),
});

export type RecruitmentData = z.infer<typeof recruitmentSchema>;

export async function extractRecruitmentInfo(requirement: string, scenario: ScenarioId) {
  const result = await generateObject({
    model: anthropic("claude-sonnet-4-6-thinking"),
    schema: recruitmentSchema,
    prompt: `你是一个专业的家政招募需求分析师。请从用户的口语化输入中，提取出标准的结构化招募要素。
如果用户没有提供某项信息，请根据场景（${scenario}）进行合理的推断补充，或者留空。

用户的原始需求：
"""
${requirement}
"""

请准确提取信息并返回。`,
  });

  return result.object;
}
