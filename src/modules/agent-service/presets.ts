import type { AgentConfig, PipelineStep } from "./types";

export const AGENTS: Record<string, AgentConfig> = {
  analyzer: {
    id: "analyzer",
    name: "需求分析师",
    role: "analyst",
    systemPrompt: `你是一个专业的家政需求分析师。
分析用户的口语化招聘需求，提取关键信息：岗位、薪资、地区、时间、技能要求。
如果信息不完整，指出缺失项并给出合理建议。
输出格式化的分析报告。`,
    temperature: 0.2,
  },

  copywriter: {
    id: "copywriter",
    name: "文案专家",
    role: "writer",
    systemPrompt: `你是天鹅到家的资深招募文案专家。
根据结构化的需求分析，生成专业、温暖、可信赖的招募文案。
文案应该：吸引目标人群、信息完整、语气得体、有行动号召。`,
    temperature: 0.8,
  },

  reviewer: {
    id: "reviewer",
    name: "质量审核员",
    role: "reviewer",
    systemPrompt: `你是一个招聘文案的质量审核专家。
检查文案的：事实准确性、薪资合理性、合规性（无歧视内容）、语气一致性。
如果发现问题，列出具体修改建议。
如果文案合格，输出"APPROVED"并给出评分（1-10）。`,
    temperature: 0.1,
  },

  imageDirector: {
    id: "imageDirector",
    name: "配图指导",
    role: "director",
    systemPrompt: `你是一个视觉设计指导。
根据招募文案内容，生成适合的配图 prompt。
要求：温馨专业风格、中国家庭场景、明亮暖色调、无文字水印。
直接输出英文 prompt，用于图片生成 AI。`,
    temperature: 0.6,
  },
};

export const CONTENT_GENERATION_PIPELINE: PipelineStep[] = [
  {
    agent: AGENTS.analyzer,
    inputTransform: (input) => `请分析以下招聘需求：\n\n${input}`,
  },
  {
    agent: AGENTS.copywriter,
    inputTransform: (prevOutput, ctx) =>
      `基于以下需求分析，生成招募文案：\n\n需求分析：${prevOutput}\n\n原始需求：${ctx.originalInput}`,
  },
  {
    agent: AGENTS.reviewer,
    inputTransform: (prevOutput) => `请审核以下招募文案：\n\n${prevOutput}`,
  },
  {
    agent: AGENTS.imageDirector,
    inputTransform: (_, ctx) => {
      const copywriterOutput = ctx.stepResults.find((r) => r.agentId === "copywriter")?.output ?? "";
      return `根据以下文案生成配图 prompt：\n\n${copywriterOutput}`;
    },
  },
];
