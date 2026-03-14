import type { ChannelId, ScenarioId, ToneId } from "@/types";

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: "generate" | "parse" | "match" | "custom";
  channel?: ChannelId;
  scenario?: ScenarioId;
  tone?: ToneId;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: TemplateVariable[];
  builtIn: boolean;
  createdAt: string;
}

export interface TemplateVariable {
  key: string;
  label: string;
  type: "text" | "number" | "select";
  required: boolean;
  defaultValue?: string;
  options?: string[];
}

export const BUILT_IN_TEMPLATES: PromptTemplate[] = [
  {
    id: "gen-premium",
    name: "高端家政品牌文案",
    description: "面向高净值客户的品牌化招募文案，强调专业度和品质感",
    category: "generate",
    tone: "formal",
    systemPrompt: `你是一位顶级家政品牌的文案总监。你的文案需要体现：
- 极致专业：强调培训体系、持证上岗、保险保障
- 品质承诺：突出品控流程、客户满意度
- 温度感：在专业中传递家的温暖
- 差异化：与普通招聘信息明显区分

语言风格：优雅精炼，避免口语化表达。每句话都经过打磨。`,
    userPromptTemplate: "请为以下高端家政招聘需求创作品牌化文案：\n\n{{requirement}}",
    variables: [
      { key: "requirement", label: "招聘需求", type: "text", required: true },
    ],
    builtIn: true,
    createdAt: "2026-01-01",
  },
  {
    id: "gen-viral",
    name: "社交裂变爆款文案",
    description: "优化传播系数的社交平台文案，注重分享率和互动率",
    category: "generate",
    tone: "social",
    systemPrompt: `你是一位精通社交传播的内容创作者。你需要：
- 前3秒抓住注意力：使用反直觉开头或情绪钩子
- 高互动设计：设置投票、提问、挑战等互动点
- 裂变引导：让读者有转发动力（"@你的闺蜜"、"转发领红包"）
- 情绪共鸣：戳中打工人/宝妈的痛点
- 平台算法友好：合理使用标签和关键词

注意：内容真实，不夸大承诺。`,
    userPromptTemplate: "请生成社交平台爆款招聘文案：\n\n需求：{{requirement}}\n目标平台调性：{{platform_hint}}",
    variables: [
      { key: "requirement", label: "招聘需求", type: "text", required: true },
      { key: "platform_hint", label: "平台调性提示", type: "text", required: false, defaultValue: "年轻化、有网感" },
    ],
    builtIn: true,
    createdAt: "2026-01-01",
  },
  {
    id: "parse-strict",
    name: "严格档案提取模式",
    description: "对信息质量要求更高，低置信度字段不做推断填充",
    category: "parse",
    systemPrompt: `你是一位严谨的信息审核专家。你的原则是：
- 只提取有明确来源的信息，不进行推测
- 模糊信息标记为 uncertain，不自动填充
- 矛盾信息全部标记为 conflict，不做取舍
- confidenceScore 标准更严格：信息缺失超过30%则低于50分
- riskFlags 更详细：每个不确定字段都要记录

输出标准 AuntieProfile JSON 格式。先输出审核说明，再输出JSON。`,
    userPromptTemplate: "请以严格模式解析以下信息：\n\n{{rawText}}",
    variables: [
      { key: "rawText", label: "原始文本", type: "text", required: true },
    ],
    builtIn: true,
    createdAt: "2026-01-01",
  },
  {
    id: "match-culture",
    name: "文化匹配优先模式",
    description: "在硬性条件之外，重点评估性格、生活习惯等软性匹配度",
    category: "match",
    systemPrompt: `你是一位擅长人际匹配的资深顾问。除了硬性条件外，你需要重点评估：
- 性格匹配度：雇主家庭风格 vs 阿姨性格特点
- 饮食习惯：口味偏好、忌口、烹饪风格
- 作息习惯：早起型/晚睡型、是否介意加班
- 沟通风格：话多/话少、主动/被动
- 文化背景：地域文化差异可能带来的影响

每个候选人增加 cultureFit 维度评分和详细原因分析。`,
    userPromptTemplate: "请以文化匹配优先模式进行评估：\n\n需求：{{requirement}}\n候选人：{{candidates}}",
    variables: [
      { key: "requirement", label: "招聘需求", type: "text", required: true },
      { key: "candidates", label: "候选人信息", type: "text", required: true },
    ],
    builtIn: true,
    createdAt: "2026-01-01",
  },
];

export function fillTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? "");
}

export function validateTemplateImport(data: unknown): { valid: boolean; error?: string; template?: PromptTemplate } {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "无效的模板格式" };
  }

  const t = data as Record<string, unknown>;

  if (typeof t.name !== "string" || !t.name.trim()) {
    return { valid: false, error: "模板名称不能为空" };
  }
  if (typeof t.systemPrompt !== "string" || !t.systemPrompt.trim()) {
    return { valid: false, error: "系统提示词不能为空" };
  }
  if (typeof t.userPromptTemplate !== "string" || !t.userPromptTemplate.trim()) {
    return { valid: false, error: "用户提示模板不能为空" };
  }

  const categories = ["generate", "parse", "match", "custom"];
  if (!categories.includes(t.category as string)) {
    return { valid: false, error: `category 必须是 ${categories.join("/")} 之一` };
  }

  const template: PromptTemplate = {
    id: `custom-${Date.now()}`,
    name: t.name as string,
    description: (t.description as string) || "",
    category: t.category as PromptTemplate["category"],
    channel: t.channel as ChannelId | undefined,
    scenario: t.scenario as ScenarioId | undefined,
    tone: t.tone as ToneId | undefined,
    systemPrompt: t.systemPrompt as string,
    userPromptTemplate: t.userPromptTemplate as string,
    variables: Array.isArray(t.variables) ? t.variables as TemplateVariable[] : [],
    builtIn: false,
    createdAt: new Date().toISOString(),
  };

  return { valid: true, template };
}
