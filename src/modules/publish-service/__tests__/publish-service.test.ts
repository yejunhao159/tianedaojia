import { describe, it, expect, beforeEach } from "vitest";
import { CHANNELS, CHANNEL_LIST, CHANNEL_IDS } from "../channels";
import { SCENARIOS, TONES } from "../scenarios";
import { createPublishTask, registerAdapter, executePublish, getTask, getAllTasks } from "../publisher";
import type { ChannelId, ChannelConfig } from "../types";
import type { PublishAdapter } from "../publisher";

describe("publish-service", () => {
  describe("渠道配置", () => {
    it("应该有 5 个渠道", () => {
      expect(CHANNEL_IDS).toHaveLength(5);
      expect(CHANNEL_LIST).toHaveLength(5);
    });

    it("应包含所有预期渠道", () => {
      const expected: ChannelId[] = ["douyin", "moments", "58city", "xiaohongshu", "wechat"];
      for (const id of expected) {
        expect(CHANNELS[id]).toBeDefined();
      }
    });

    it("每个渠道应包含完整配置", () => {
      for (const ch of CHANNEL_LIST) {
        expect(ch.id).toBeTruthy();
        expect(ch.name).toBeTruthy();
        expect(ch.maxTextLength).toBeGreaterThan(0);
        expect(ch.formatRules).toBeTruthy();
      }
    });

    it("抖音应该是 9:16 竖屏", () => {
      expect(CHANNELS.douyin.imageAspect).toBe("9:16");
      expect(CHANNELS.douyin.maxTextLength).toBe(300);
    });

    it("58同城应该是结构化格式", () => {
      expect(CHANNELS["58city"].formatRules).toContain("【职位名称】");
    });
  });

  describe("场景与语气", () => {
    it("应该有 4 个场景和 3 种语气", () => {
      expect(SCENARIOS).toHaveLength(4);
      expect(TONES).toHaveLength(3);
    });
  });

  describe("发布任务管理", () => {
    it("createPublishTask 应创建 draft 状态的任务", () => {
      const task = createPublishTask("douyin", "测试文案");
      expect(task.status).toBe("draft");
      expect(task.channelId).toBe("douyin");
      expect(task.retryCount).toBe(0);
    });

    it("带 scheduledAt 应创建 scheduled 状态", () => {
      const future = Date.now() + 3600000;
      const task = createPublishTask("douyin", "定时发布", [], future);
      expect(task.status).toBe("scheduled");
      expect(task.scheduledAt).toBe(future);
    });

    it("getTask 应返回已创建的任务", () => {
      const task = createPublishTask("moments", "查询测试");
      const found = getTask(task.id);
      expect(found).toBeDefined();
      expect(found?.content).toBe("查询测试");
    });
  });

  describe("发布执行", () => {
    it("无 adapter 时应返回 failed", async () => {
      const task = createPublishTask("wechat", "无适配器测试");
      const result = await executePublish(task.id);
      expect(result.status).toBe("failed");
      expect(result.error).toContain("No adapter");
    });

    it("注册 adapter 后应能发布", async () => {
      const mockAdapter: PublishAdapter = {
        channelId: "douyin",
        publish: async () => ({ success: true, url: "https://douyin.com/post/123" }),
        validate: (content) => ({
          valid: content.length > 0,
          errors: content.length === 0 ? ["内容不能为空"] : [],
        }),
      };
      registerAdapter(mockAdapter);

      const task = createPublishTask("douyin", "适配器测试文案");
      const result = await executePublish(task.id);
      expect(result.status).toBe("published");
      expect(result.publishedAt).toBeGreaterThan(0);
    });

    it("validation 失败时应返回 failed", async () => {
      const strictAdapter: PublishAdapter = {
        channelId: "xiaohongshu",
        publish: async () => ({ success: true }),
        validate: () => ({ valid: false, errors: ["标题太短"] }),
      };
      registerAdapter(strictAdapter);

      const task = createPublishTask("xiaohongshu", "短");
      const result = await executePublish(task.id);
      expect(result.status).toBe("failed");
      expect(result.error).toContain("标题太短");
    });
  });
});
