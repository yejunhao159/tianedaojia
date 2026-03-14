import { describe, it, expect } from "vitest";
import { AGENTS, CONTENT_GENERATION_PIPELINE } from "../presets";
import { createSession, getSession, deleteSession, addMessage, getHistory, listSessions } from "../session";
import type { AgentConfig, PipelineContext } from "../types";

describe("agent-server", () => {

  // ========== Agent 配置 ==========
  describe("预设 Agent 配置", () => {
    it("应该有 4 个预设 Agent：analyzer/copywriter/reviewer/imageDirector", () => {
      expect(Object.keys(AGENTS)).toHaveLength(4);
      expect(AGENTS.analyzer).toBeDefined();
      expect(AGENTS.copywriter).toBeDefined();
      expect(AGENTS.reviewer).toBeDefined();
      expect(AGENTS.imageDirector).toBeDefined();
    });

    it("每个 Agent 的 systemPrompt 应有明确的角色定位", () => {
      expect(AGENTS.analyzer.systemPrompt).toContain("分析");
      expect(AGENTS.copywriter.systemPrompt).toContain("文案");
      expect(AGENTS.reviewer.systemPrompt).toContain("审核");
      expect(AGENTS.imageDirector.systemPrompt).toContain("配图");
    });

    it("temperature 应符合角色特性", () => {
      expect(AGENTS.analyzer.temperature).toBeLessThanOrEqual(0.3);
      expect(AGENTS.copywriter.temperature).toBeGreaterThanOrEqual(0.7);
      expect(AGENTS.reviewer.temperature).toBeLessThanOrEqual(0.2);
    });
  });

  // ========== Pipeline ==========
  describe("内容生成 Pipeline", () => {
    it("应有 4 步：分析→生成→审核→配图", () => {
      const ids = CONTENT_GENERATION_PIPELINE.map((s) => s.agent.id);
      expect(ids).toEqual(["analyzer", "copywriter", "reviewer", "imageDirector"]);
    });

    it("每步的 inputTransform 应正确组装上下文", () => {
      const ctx: PipelineContext = {
        originalInput: "原始需求",
        stepResults: [{ agentId: "copywriter", success: true, output: "生成的文案", durationMs: 100 }],
        metadata: {},
      };

      const imageStep = CONTENT_GENERATION_PIPELINE[3];
      const input = imageStep.inputTransform!("", ctx);
      expect(input).toContain("生成的文案");
    });
  });

  // ========== 会话管理 ==========
  describe("会话管理", () => {
    it("创建会话应返回有效 session", () => {
      const session = createSession("analyzer");
      expect(session.id).toBeTruthy();
      expect(session.agentId).toBe("analyzer");
      expect(session.messages).toHaveLength(0);
    });

    it("getSession 应返回已创建的会话", () => {
      const session = createSession("copywriter");
      const found = getSession(session.id);
      expect(found?.id).toBe(session.id);
    });

    it("不存在的会话应返回 null", () => {
      expect(getSession("fake-id")).toBeNull();
    });

    it("addMessage 应向会话添加消息", () => {
      const session = createSession("reviewer");
      addMessage(session.id, { role: "user", content: "请审核这段文案" });
      addMessage(session.id, { role: "assistant", content: "文案合格", agentId: "reviewer" });

      const history = getHistory(session.id);
      expect(history).toHaveLength(2);
      expect(history[0].role).toBe("user");
      expect(history[1].content).toBe("文案合格");
      expect(history[1].timestamp).toBeGreaterThan(0);
    });

    it("deleteSession 应删除会话", () => {
      const session = createSession("analyzer");
      expect(deleteSession(session.id)).toBe(true);
      expect(getSession(session.id)).toBeNull();
    });

    it("listSessions 应返回按时间排序的会话列表", () => {
      createSession("a1");
      createSession("a2");
      const list = listSessions();
      expect(list.length).toBeGreaterThanOrEqual(2);
      expect(list[0].lastActiveAt).toBeGreaterThanOrEqual(list[1].lastActiveAt);
    });
  });
});
