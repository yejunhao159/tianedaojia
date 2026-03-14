import type { PromptBuilder } from "./engine";
import type { ChannelInfo } from "../types";

const TONE_MAP: Record<string, string> = {
  formal: "正式专业，措辞严谨，适合正规招聘平台",
  friendly: "亲切友好，像邻居聊天一样自然，有温度感",
  social: "社交活泼，年轻化网感表达，抓人眼球",
};

const SCENARIO_CTX: Record<string, string> = {
  hourly: "钟点工/小时工招聘，按时计费，灵活用工",
  nanny: "住家保姆招聘，长期稳定，需要日常家务+做饭能力",
  maternity: "月嫂招聘，专业母婴护理，高薪高要求",
  cleaning: "保洁人员招聘，日常清洁或深度清洁服务",
};

interface GenerateSystemVars {
  channelConfig: ChannelInfo;
  tone: string;
  scenario: string;
}

interface GenerateUserVars {
  requirement: string;
}

export const generatePrompt: PromptBuilder<GenerateSystemVars, GenerateUserVars> = {
  id: "generate",
  name: "招募文案生成",

  buildSystem: (vars) => {
    if (!vars) return "你是「天鹅到家」平台的资深招募文案专家。所有输出必须使用中文。";
    const ch = vars.channelConfig;
    return `你是「天鹅到家」平台的资深招募文案专家。

## 绝对规则
- 所有输出必须是中文，禁止使用英文
- 直接输出文案正文，不要加任何标题、解释、前缀
- 不要输出「以下是文案」「这是为您生成的」等解释性文字
- 不要输出 markdown 格式标记
- 严格控制在 ${ch.maxTextLength} 字以内

## 当前渠道：${ch.name}
${ch.formatRules}

## 语气：${TONE_MAP[vars.tone] ?? vars.tone}
渠道调性：${ch.toneHint}

## 场景：${SCENARIO_CTX[vars.scenario] ?? vars.scenario}

## 品牌
天鹅到家，专业家政服务平台。调性：专业、温暖、可信赖。`;
  },

  buildUser: (vars) => `请根据以下招聘需求，直接输出${vars.requirement.length > 50 ? "适配渠道的招募" : ""}文案：\n\n${vars.requirement}`,
};
