import { GoogleGenAI } from "@google/genai";

let _genai: GoogleGenAI | null = null;

export function getImageClient() {
  if (!_genai) {
    _genai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!,
      httpOptions: {
        baseUrl: process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com",
      },
    });
  }
  return _genai;
}
