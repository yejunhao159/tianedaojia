import { describe, it, expect } from "vitest";
import { TASK_DEFAULTS } from "../client";
import { TEXT_MODELS } from "../models";
import { generatePrompt } from "../prompts/generate";
import { parsePrompt } from "../prompts/parse";
import { matchPrompt } from "../prompts/match";
import { recruitmentSchema } from "../extract";
import type { ChannelInfo, TaskType } from "../types";

describe("text-service", () => {
  describe("任务参数配置", () => {
    it("应该为 4 种任务类型定义默认参数", () => {
      const tasks: TaskType[] = ["generate", "parse", "match", "extract"];
      for (const task of tasks) {
        expect(TASK_DEFAULTS[task]).toBeDefined();
        expect(TASK_DEFAULTS[task].model).toBeTruthy();
        expect(TASK_DEFAULTS[task].temperature).toBeGreaterThanOrEqual(0);
        expect(TASK_DEFAULTS[task].maxOutputTokens).toBeGreaterThan(0);
      }
    });

    it("generate 应该有最高的 temperature（创意任务）", () => {
      expect(TASK_DEFAULTS.generate.temperature).toBeGreaterThan(TASK_DEFAULTS.parse.temperature);
      expect(TASK_DEFAULTS.generate.temperature).toBeGreaterThan(TASK_DEFAULTS.match.temperature);
    });

    it("extract 应该有最低的 temperature（精确任务）", () => {
      expect(TASK_DEFAULTS.extract.temperature).toBeLessThanOrEqual(TASK_DEFAULTS.parse.temperature);
    });
  });

  describe("模型列表", () => {
    it("应该至少有 2 个模型", () => {
      expect(TEXT_MODELS.length).toBeGreaterThanOrEqual(2);
    });

    it("每个模型应该有完整的配置信息", () => {
      for (const model of TEXT_MODELS) {
        expect(model.id).toBeTruthy();
        expect(model.name).toBeTruthy();
        expect(model.description).toBeTruthy();
        expect(["low", "medium", "high"]).toContain(model.costTier);
      }
    });
  });

  describe("Prompt 模板 — 文案生成", () => {
    const mockChannel: ChannelInfo = {
      name: "抖音",
      maxTextLength: 300,
      toneHint: "活泼吸引",
      formatRules: "300字以内，短句为主",
    };

    it("buildSystem 应该包含渠道信息", () => {
      const system = generatePrompt.buildSystem({
        channelConfig: mockChannel,
        tone: "social",
        scenario: "hourly",
      });
      expect(system).toContain("抖音");
      expect(system).toContain("300");
      expect(system).toContain("天鹅到家");
    });

    it("buildSystem 无参数时应返回默认提示", () => {
      const system = generatePrompt.buildSystem();
      expect(system).toContain("天鹅到家");
    });

    it("buildUser 应该包含用户需求", () => {
      const user = generatePrompt.buildUser({ requirement: "招一个住家保姆" });
      expect(user).toContain("招一个住家保姆");
    });
  });

  describe("Prompt 模板 — 信息解析", () => {
    it("buildSystem 应包含 JSON 格式说明", () => {
      const system = parsePrompt.buildSystem();
      expect(system).toContain("json");
      expect(system).toContain("confidenceScore");
      expect(system).toContain("riskFlags");
    });

    it("buildUser 应包含原始文本", () => {
      const user = parsePrompt.buildUser({ rawText: "张阿姨，48岁，四川人" });
      expect(user).toContain("张阿姨，48岁，四川人");
    });
  });

  describe("Prompt 模板 — 智能匹配", () => {
    it("buildSystem 应包含评分维度", () => {
      const system = matchPrompt.buildSystem();
      expect(system).toContain("district");
      expect(system).toContain("skill");
      expect(system).toContain("price");
      expect(system).toContain("totalScore");
    });

    it("buildUser 应包含需求和候选人", () => {
      const user = matchPrompt.buildUser({
        requirement: "朝阳区住家保姆",
        candidates: "张阿姨...",
      });
      expect(user).toContain("朝阳区住家保姆");
      expect(user).toContain("张阿姨");
    });
  });

  describe("结构化提取 Schema", () => {
    it("recruitmentSchema 应该能解析有效数据", () => {
      const valid = {
        jobTitle: "住家保姆",
        salary: "6000-8000/月",
        location: "朝阳区",
        schedule: "做六休一",
        requirements: ["会做饭", "能照顾老人"],
        duties: ["做饭", "打扫卫生"],
        benefits: ["包吃住"],
      };
      const result = recruitmentSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("recruitmentSchema 缺少必填字段应失败", () => {
      const invalid = { jobTitle: "保姆" };
      const result = recruitmentSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });
});
