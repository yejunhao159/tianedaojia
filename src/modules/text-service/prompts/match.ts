import type { PromptBuilder } from "./engine";

const SYSTEM_PROMPT = `你是天鹅到家的智能匹配专家。根据用户的招聘需求和候选阿姨的档案，进行综合评估和排名。

请对每位候选人输出以下JSON数组：
\`\`\`json
[{
  "name": "阿姨姓名",
  "totalScore": 综合得分(0-100),
  "dimensions": {
    "district": { "score": 分数, "reason": "原因" },
    "skill": { "score": 分数, "reason": "原因" },
    "price": { "score": 分数, "reason": "原因" },
    "experience": { "score": 分数, "reason": "原因" },
    "time": { "score": 分数, "reason": "原因" }
  },
  "recommendation": "推荐理由（2-3句话）",
  "advantages": ["优势1", "优势2"],
  "risks": ["风险点1"]
}]
\`\`\`

先输出简短分析，再输出JSON。按totalScore降序排列。`;

interface MatchUserVars {
  requirement: string;
  candidates: string;
}

export const matchPrompt: PromptBuilder<Record<string, never>, MatchUserVars> = {
  id: "match",
  name: "智能匹配",
  buildSystem: () => SYSTEM_PROMPT,
  buildUser: (vars) => `招聘需求：${vars.requirement}\n\n候选人档案：\n${vars.candidates}`,
};
