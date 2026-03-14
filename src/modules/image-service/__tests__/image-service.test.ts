import { describe, it, expect } from "vitest";
import { IMAGE_MODEL, normalizeAspect, clampResolution } from "../models";
import { IMAGE_TEMPLATES, getImageTemplate } from "../templates";
import type { GenerateImageOptions, CreateChatOptions } from "../types";

describe("image-service", () => {
  describe("模型配置", () => {
    it("应该使用 gemini-3.1-flash-image-preview 作为默认模型", () => {
      expect(IMAGE_MODEL.id).toBe("gemini-3.1-flash-image-preview");
    });

    it("最大分辨率应该是 2K", () => {
      expect(IMAGE_MODEL.maxResolution).toBe("2K");
    });

    it("最多支持 10 张输入图片", () => {
      expect(IMAGE_MODEL.maxInputImages).toBe(10);
    });

    it("应该支持所有标准宽高比", () => {
      expect(IMAGE_MODEL.supportedAspects).toContain("1:1");
      expect(IMAGE_MODEL.supportedAspects).toContain("9:16");
      expect(IMAGE_MODEL.supportedAspects).toContain("16:9");
      expect(IMAGE_MODEL.supportedAspects).toContain("3:4");
    });
  });

  describe("宽高比归一化", () => {
    it("有效宽高比应原样返回", () => {
      expect(normalizeAspect("1:1")).toBe("1:1");
      expect(normalizeAspect("9:16")).toBe("9:16");
      expect(normalizeAspect("16:9")).toBe("16:9");
    });

    it("无效宽高比应回退到 1:1", () => {
      expect(normalizeAspect("invalid")).toBe("1:1");
      expect(normalizeAspect("")).toBe("1:1");
      expect(normalizeAspect("5:3")).toBe("1:1");
    });
  });

  describe("分辨率钳制", () => {
    it("请求 1K 应返回 1K", () => {
      expect(clampResolution("1K")).toBe("1K");
    });

    it("请求 2K 应返回 2K（模型最大值）", () => {
      expect(clampResolution("2K")).toBe("2K");
    });

    it("请求 512 应返回 512", () => {
      expect(clampResolution("512")).toBe("512");
    });

    it("超出范围的值应回退到 1K", () => {
      expect(clampResolution("invalid" as never)).toBe("1K");
    });
  });

  describe("系统指令模板", () => {
    it("应该有 9 套模板", () => {
      expect(Object.keys(IMAGE_TEMPLATES)).toHaveLength(9);
    });

    it("每个模板应包含必要字段", () => {
      for (const tpl of Object.values(IMAGE_TEMPLATES)) {
        expect(tpl.id).toBeTruthy();
        expect(tpl.name).toBeTruthy();
        expect(tpl.description).toBeTruthy();
        expect(tpl.systemInstruction.length).toBeGreaterThan(50);
      }
    });

    it("getImageTemplate 应该返回指定模板", () => {
      const tpl = getImageTemplate("recruit_warm");
      expect(tpl.id).toBe("recruit_warm");
      expect(tpl.name).toContain("温馨");
    });

    it("getImageTemplate 无效 ID 应返回默认模板", () => {
      const tpl = getImageTemplate(undefined);
      expect(tpl.id).toBe("default");
    });

    it("家政招聘模板应包含家政相关关键词", () => {
      const warm = IMAGE_TEMPLATES.recruit_warm;
      expect(warm.systemInstruction).toContain("家政");
      expect(warm.systemInstruction).toContain("温馨");

      const pro = IMAGE_TEMPLATES.recruit_professional;
      expect(pro.systemInstruction).toContain("专业");
    });
  });

  describe("生成选项类型", () => {
    it("GenerateImageOptions 应接受最小配置", () => {
      const opts: GenerateImageOptions = { prompt: "画一张图" };
      expect(opts.prompt).toBe("画一张图");
      expect(opts.aspect).toBeUndefined();
    });

    it("CreateChatOptions 应接受完整配置", () => {
      const opts: CreateChatOptions = {
        aspect: "9:16",
        resolution: "2K",
        template: "socialMedia",
        thinkingLevel: "high",
      };
      expect(opts.thinkingLevel).toBe("high");
    });
  });
});
