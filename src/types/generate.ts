import type { ChannelId, ScenarioId, ToneId } from "./common";

export interface GeneratedContent {
  channelId: ChannelId;
  text: string;
  title?: string;
  tags?: string[];
  images: { url: string; aspect: string; selected: boolean }[];
  createdAt: Date;
}

export interface GenerateRequest {
  requirement: string;
  scenario: ScenarioId;
  tone: ToneId;
  channel?: ChannelId;
}
