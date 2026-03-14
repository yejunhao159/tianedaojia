import type { ScenarioConfig, ToneConfig } from "./types";

export const SCENARIOS: ScenarioConfig[] = [
  { id: "hourly", name: "钟点工", icon: "clock", requiredSkills: ["做饭", "保洁", "收纳"],
    sampleRequirement: "需要一位钟点工，每周3次上门做饭+简单保洁，朝阳区，预算30-40元/小时" },
  { id: "nanny", name: "住家保姆", icon: "home", requiredSkills: ["做饭", "保洁", "照顾老人", "收纳整理"],
    sampleRequirement: "需要一位住家保姆，擅长做饭（最好会川菜），能照顾老人，朝阳区，月薪6000-8000" },
  { id: "maternity", name: "月嫂", icon: "baby", requiredSkills: ["新生儿护理", "产妇护理", "月子餐"],
    sampleRequirement: "预产期下月，需要金牌月嫂，最好持有高级月嫂证，海淀区，预算15000-20000/月" },
  { id: "cleaning", name: "保洁", icon: "sparkles", requiredSkills: ["日常保洁", "深度清洁"],
    sampleRequirement: "120平三居室日常保洁，每周2次每次3小时，西城区，预算35元/小时" },
];

export const TONES: ToneConfig[] = [
  { id: "formal", name: "正式专业", icon: "briefcase", description: "适合58同城、微信公众号等正式渠道" },
  { id: "friendly", name: "亲切友好", icon: "heart", description: "适合朋友圈、微信群等社交场景" },
  { id: "social", name: "社交活泼", icon: "zap", description: "适合抖音、小红书等内容平台" },
];
