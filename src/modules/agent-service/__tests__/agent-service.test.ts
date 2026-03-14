import { describe, it, expect } from "vitest";
import { AGENTS, CONTENT_GENERATION_PIPELINE } from "../presets";
import type { AgentConfig, PipelineStep } from "../types";

describe("agent-service", () => {
  describe("预设 Agent 配置", () => {
    it("应该有 4 个预设 Agent", () => {
      expect(Object.keys(AGENTS)).toHaveLength(4);
    });

    it("每个 Agent 应有完整的配置", () => {
      for (const agent of Object.values(AGENTS)) {
        expect(agent.id).toBeTruthy();
        expect(agent.name).toBeTruthy();
        expect(agent.role).toBeTruthy();
        expect(agent.systemPrompt.length).toBeGreaterThan(20);
      }
    });

    it("analyzer 应该有低 temperature（精确分析）", () => {
      expect(AGENTS.analyzer.temperature).toBeLessThanOrEqual(0.3);
    });

    it("copywriter 应该有高 temperature（创意写作）", () => {
      expect(AGENTS.copywriter.temperature).toBeGreaterThanOrEqual(0.7);
    });

    it("reviewer 应该有最低 temperature（严格审核）", () => {
      expect(AGENTS.reviewer.temperature).toBeLessThanOrEqual(0.2);
    });
  });

  describe("内容生成 Pipeline", () => {
    it("应该有 4 个步骤", () => {
      expect(CONTENT_GENERATION_PIPELINE).toHaveLength(4);
    });

    it("步骤顺序应为：分析→生成→审核→配图", () => {
      const ids = CONTENT_GENERATION_PIPELINE.map((s) => s.agent.id);
      expect(ids).toEqual(["analyzer", "copywriter", "reviewer", "imageDirector"]);
    });

    it("每个步骤应有 inputTransform", () => {
      for (const step of CONTENT_GENERATION_PIPELINE) {
        expect(step.inputTransform).toBeDefined();
      }
    });

    it("inputTransform 应该正确组装上下文", () => {
      const analyzerStep = CONTENT_GENERATION_PIPELINE[0];
      const transformed = analyzerStep.inputTransform!("test", {
        originalInput: "原始需求",
        stepResults: [],
        metadata: {},
      });
      expect(transformed).toContain("test");
    });
  });

  describe("AgentConfig 类型", () => {
    it("应接受最小配置", () => {
      const config: AgentConfig = {
        id: "test",
        name: "测试",
        role: "test",
        systemPrompt: "你是一个测试助手",
      };
      expect(config.id).toBe("test");
      expect(config.model).toBeUndefined();
    });
  });
});
