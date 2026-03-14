export type TextModelId =
  | "claude-sonnet-4-6-thinking"
  | "claude-sonnet-4-6"
  | "gemini-2.5-flash"
  | "gemini-2.5-pro";

export interface TextModelConfig {
  id: TextModelId;
  name: string;
  description: string;
  maxOutputTokens: number;
  supportsThinking: boolean;
  costTier: "low" | "medium" | "high";
}

export type TaskType = "generate" | "parse" | "match" | "extract";

export interface TaskParams {
  model: TextModelId;
  temperature: number;
  maxOutputTokens: number;
}

export interface ChannelInfo {
  name: string;
  maxTextLength: number;
  toneHint: string;
  formatRules: string;
}

export type InfoSourceType = "wechat" | "phone" | "moments" | "agent";

export interface RawInfoMessage {
  id: string;
  source: InfoSourceType;
  sender: string;
  content: string;
  time: string;
}

export interface AuntieProfile {
  id: string;
  name: string;
  age: number;
  origin: string;
  skills: string[];
  certificates: string[];
  workPreference: {
    districts: string[];
    timeSlots: string[];
    salaryRange: { min: number; max: number };
  };
  experience: { years: number; highlights: string[] };
  riskFlags: { field: string; issue: string; severity: "low" | "medium" | "high" }[];
  confidenceScore: number;
}

export interface MatchRequirement {
  position: string;
  district: string;
  skills: string[];
  salaryRange: { min: number; max: number };
  experience: number;
}

export interface MatchDimension {
  key: string;
  label: string;
  weight: number;
  score: number;
}

export interface MatchCandidate {
  profile: AuntieProfile;
  dimensions: MatchDimension[];
  hardScore: number;
  softScore: number;
  totalScore: number;
  recommendation: string;
  rank: number;
}

export interface GeneratedContent {
  channelId: string;
  text: string;
  title?: string;
  tags?: string[];
  images: { url: string; aspect: string; selected: boolean }[];
  createdAt: Date;
}

export interface GenerateRequest {
  requirement: string;
  scenario: string;
  tone: string;
  channel?: string;
}
