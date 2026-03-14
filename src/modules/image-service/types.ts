export type ImageModelId = "gemini-3.1-flash-image-preview";
export type ImageSize = "512" | "1K" | "2K";
export type ImageThinkingLevel = "minimal" | "high";
export type AspectRatio = string;

export interface ImageModelConfig {
  id: ImageModelId;
  name: string;
  maxInputImages: number;
  maxResolution: ImageSize;
  supportedAspects: string[];
}

export interface ImageTemplate {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
}

export interface ImageResult {
  success: boolean;
  imageBase64?: string;
  mimeType?: string;
  imageUrl?: string;
  text?: string;
  error?: string;
  resolution?: ImageSize;
  template?: string;
}

export interface GenerateImageOptions {
  prompt: string;
  aspect?: string;
  resolution?: ImageSize;
  template?: string;
  customSystemInstruction?: string;
  thinkingLevel?: ImageThinkingLevel;
}

export interface ChatSession {
  id: string;
  history: ChatMessage[];
  config: ChatConfig;
  createdAt: number;
  lastActiveAt: number;
}

export interface ChatMessage {
  role: "user" | "model";
  parts: ChatPart[];
}

export interface ChatPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
  thought?: boolean;
  thoughtSignature?: string;
}

export interface ChatConfig {
  aspect: string;
  resolution: ImageSize;
  systemInstruction: string;
  thinkingLevel: ImageThinkingLevel;
}

export interface CreateChatOptions {
  aspect?: string;
  resolution?: ImageSize;
  template?: string;
  customSystemInstruction?: string;
  thinkingLevel?: ImageThinkingLevel;
}

export interface ChatSendOptions {
  sessionId: string;
  prompt: string;
  inputImageBase64?: string;
  inputImageMimeType?: string;
}
