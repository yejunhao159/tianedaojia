import type { MediaFile, MediaType, MimeType } from "./types";

const MIME_TO_TYPE: Record<string, MediaType> = {
  "image/png": "image", "image/jpeg": "image", "image/webp": "image", "image/gif": "image",
  "audio/mp3": "audio", "audio/wav": "audio", "audio/ogg": "audio", "audio/webm": "audio",
  "video/mp4": "video", "video/webm": "video", "video/mov": "video",
  "application/pdf": "document",
  "text/plain": "text",
};

const MAX_SIZES: Record<MediaType, number> = {
  image: 20 * 1024 * 1024,
  audio: 50 * 1024 * 1024,
  video: 100 * 1024 * 1024,
  document: 20 * 1024 * 1024,
  text: 1 * 1024 * 1024,
};

export function detectMediaType(mimeType: string): MediaType {
  return MIME_TO_TYPE[mimeType] ?? "text";
}

export function validateFile(file: { name: string; size: number; mimeType: string }): { valid: boolean; error?: string } {
  const type = detectMediaType(file.mimeType);

  if (!MIME_TO_TYPE[file.mimeType]) {
    return { valid: false, error: `不支持的文件格式: ${file.mimeType}` };
  }

  const maxSize = MAX_SIZES[type];
  if (file.size > maxSize) {
    return { valid: false, error: `文件过大: ${(file.size / 1024 / 1024).toFixed(1)}MB，${type} 最大 ${maxSize / 1024 / 1024}MB` };
  }

  return { valid: true };
}

export function createMediaFile(opts: {
  name: string;
  mimeType: string;
  size: number;
  base64Data?: string;
  url?: string;
}): MediaFile {
  return {
    id: crypto.randomUUID(),
    name: opts.name,
    type: detectMediaType(opts.mimeType),
    mimeType: opts.mimeType as MimeType,
    size: opts.size,
    base64Data: opts.base64Data,
    url: opts.url,
    createdAt: Date.now(),
  };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
