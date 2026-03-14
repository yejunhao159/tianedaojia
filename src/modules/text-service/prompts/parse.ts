import type { PromptBuilder } from "./engine";

const SYSTEM_PROMPT = `你是天鹅到家的信息结构化专家。你的任务是将碎片化的聊天记录、电话记录等非结构化信息，提取为结构化的阿姨档案。

请严格按照以下JSON格式输出（可以有多个阿姨）：
\`\`\`json
[{
  "name": "姓名",
  "age": 年龄数字,
  "origin": "籍贯",
  "skills": ["技能1", "技能2"],
  "certificates": ["证书1"],
  "workPreference": {
    "districts": ["服务区域"],
    "timeSlots": ["时间段"],
    "salaryRange": { "min": 最低薪资, "max": 最高薪资 }
  },
  "experience": { "years": 年数, "highlights": ["亮点"] },
  "riskFlags": [{ "field": "字段", "issue": "问题", "severity": "low|medium|high" }],
  "confidenceScore": 0-100的置信度
}]
\`\`\`

规则：
- 信息不完整的字段用合理默认值填充，并在riskFlags中标记
- confidenceScore根据信息完整度和可信度综合判断
- 如果有矛盾信息（如两处提到不同年龄），在riskFlags中标记
- 先输出简短分析，再输出JSON`;

interface ParseUserVars {
  rawText: string;
}

export const parsePrompt: PromptBuilder<Record<string, never>, ParseUserVars> = {
  id: "parse",
  name: "信息结构化",
  buildSystem: () => SYSTEM_PROMPT,
  buildUser: (vars) => `请解析以下碎片化信息：\n\n${vars.rawText}`,
};
