export type ChannelId = "douyin" | "moments" | "58city" | "xiaohongshu" | "wechat" | "wechat_group";
export type ToneId = "formal" | "friendly" | "social";
export type ScenarioId = "hourly" | "nanny" | "maternity" | "cleaning";

export interface ChannelConfig {
  id: ChannelId;
  name: string;
  icon: string;
  maxTextLength: number;
  imageAspect: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  imageCount: number;
  toneHint: string;
  formatRules: string;
  previewWidth: number;
}

export interface ScenarioConfig {
  id: ScenarioId;
  name: string;
  icon: string;
  requiredSkills: string[];
  sampleRequirement: string;
}

export interface ToneConfig {
  id: ToneId;
  name: string;
  icon: string;
  description: string;
}
