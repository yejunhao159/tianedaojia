import { GoogleGenAI } from "@google/genai";

let _client: GoogleGenAI | null = null;

export function getMultimodalClient(): GoogleGenAI {
  if (!_client) {
    _client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
      httpOptions: {
        baseUrl: process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com",
      },
    });
  }
  return _client;
}

export const MODELS = {
  embedding: "gemini-embedding-001",
  vision: "gemini-2.5-flash",
  audio: "gemini-2.5-flash",
  video: "gemini-2.5-flash",
} as const;
