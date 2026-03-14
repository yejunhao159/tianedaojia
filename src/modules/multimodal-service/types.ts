export type MediaType = "image" | "audio" | "video" | "document" | "text";

export type MimeType =
  | "image/png" | "image/jpeg" | "image/webp" | "image/gif"
  | "audio/mp3" | "audio/wav" | "audio/ogg" | "audio/webm"
  | "video/mp4" | "video/webm" | "video/mov"
  | "application/pdf"
  | "text/plain";

export interface MediaFile {
  id: string;
  name: string;
  type: MediaType;
  mimeType: MimeType;
  size: number;
  base64Data?: string;
  url?: string;
  createdAt: number;
}

export interface ExtractionResult {
  success: boolean;
  mediaId: string;
  type: MediaType;
  text?: string;
  structuredData?: Record<string, unknown>;
  confidence: number;
  error?: string;
  durationMs: number;
}

export interface EmbeddingResult {
  success: boolean;
  mediaId: string;
  vector: number[];
  dimensions: number;
  model: string;
  error?: string;
}

export interface SemanticSearchResult {
  mediaId: string;
  score: number;
  text?: string;
  metadata?: Record<string, unknown>;
}

export interface VectorRecord {
  id: string;
  mediaId: string;
  vector: number[];
  text: string;
  metadata: Record<string, unknown>;
  createdAt: number;
}
