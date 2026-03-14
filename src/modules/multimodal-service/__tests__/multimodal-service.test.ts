import { describe, it, expect } from "vitest";
import { detectMediaType, validateFile, createMediaFile } from "../upload";
import {
  addToVectorStore, getVectorStore, clearVectorStore, semanticSearch,
} from "../embedding";
import { MODELS } from "../client";

describe("multimodal-service", () => {

  describe("媒体类型检测", () => {
    it("应正确检测图片类型", () => {
      expect(detectMediaType("image/png")).toBe("image");
      expect(detectMediaType("image/jpeg")).toBe("image");
      expect(detectMediaType("image/webp")).toBe("image");
    });

    it("应正确检测音频类型", () => {
      expect(detectMediaType("audio/mp3")).toBe("audio");
      expect(detectMediaType("audio/wav")).toBe("audio");
    });

    it("应正确检测视频类型", () => {
      expect(detectMediaType("video/mp4")).toBe("video");
      expect(detectMediaType("video/webm")).toBe("video");
    });

    it("应正确检测文档类型", () => {
      expect(detectMediaType("application/pdf")).toBe("document");
    });

    it("未知类型应回退到 text", () => {
      expect(detectMediaType("application/octet-stream")).toBe("text");
    });
  });

  describe("文件校验", () => {
    it("有效图片应通过", () => {
      const result = validateFile({ name: "photo.jpg", size: 1024 * 1024, mimeType: "image/jpeg" });
      expect(result.valid).toBe(true);
    });

    it("超大图片应拒绝", () => {
      const result = validateFile({ name: "huge.png", size: 25 * 1024 * 1024, mimeType: "image/png" });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("文件过大");
    });

    it("不支持的格式应拒绝", () => {
      const result = validateFile({ name: "file.exe", size: 1024, mimeType: "application/exe" });
      expect(result.valid).toBe(false);
      expect(result.error).toContain("不支持");
    });

    it("PDF 文档应通过", () => {
      const result = validateFile({ name: "resume.pdf", size: 5 * 1024 * 1024, mimeType: "application/pdf" });
      expect(result.valid).toBe(true);
    });

    it("视频 100MB 以内应通过", () => {
      const result = validateFile({ name: "interview.mp4", size: 80 * 1024 * 1024, mimeType: "video/mp4" });
      expect(result.valid).toBe(true);
    });
  });

  describe("MediaFile 创建", () => {
    it("应创建完整的 MediaFile 对象", () => {
      const file = createMediaFile({
        name: "cert.jpg",
        mimeType: "image/jpeg",
        size: 2048,
        base64Data: "abc123",
      });
      expect(file.id).toBeTruthy();
      expect(file.type).toBe("image");
      expect(file.name).toBe("cert.jpg");
      expect(file.base64Data).toBe("abc123");
      expect(file.createdAt).toBeGreaterThan(0);
    });
  });

  describe("向量数据库", () => {
    it("addToVectorStore 应存储记录", () => {
      clearVectorStore();
      const record = addToVectorStore({
        mediaId: "m1",
        vector: [0.1, 0.2, 0.3],
        text: "测试文本",
        metadata: { source: "test" },
      });
      expect(record.id).toBeTruthy();
      expect(getVectorStore()).toHaveLength(1);
    });

    it("semanticSearch 应按相似度排序", () => {
      clearVectorStore();
      addToVectorStore({ mediaId: "a", vector: [1, 0, 0], text: "向量A", metadata: {} });
      addToVectorStore({ mediaId: "b", vector: [0, 1, 0], text: "向量B", metadata: {} });
      addToVectorStore({ mediaId: "c", vector: [0.9, 0.1, 0], text: "向量C", metadata: {} });

      const results = semanticSearch([1, 0, 0], 3, 0);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].mediaId).toBe("a");
      expect(results[0].score).toBeCloseTo(1, 2);
    });

    it("semanticSearch 应过滤低分结果", () => {
      clearVectorStore();
      addToVectorStore({ mediaId: "x", vector: [1, 0, 0], text: "X", metadata: {} });
      addToVectorStore({ mediaId: "y", vector: [0, 1, 0], text: "Y", metadata: {} });

      const results = semanticSearch([1, 0, 0], 10, 0.9);
      expect(results).toHaveLength(1);
      expect(results[0].mediaId).toBe("x");
    });

    it("clearVectorStore 应清空所有记录", () => {
      addToVectorStore({ mediaId: "z", vector: [1], text: "Z", metadata: {} });
      clearVectorStore();
      expect(getVectorStore()).toHaveLength(0);
    });
  });

  describe("模型配置", () => {
    it("应有 embedding 模型", () => {
      expect(MODELS.embedding).toBeTruthy();
    });

    it("应有 vision 模型", () => {
      expect(MODELS.vision).toBeTruthy();
    });
  });
});
