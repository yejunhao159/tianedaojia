import { describe, it, expect } from "vitest";
import { CHANNELS, CHANNEL_LIST, CHANNEL_IDS } from "../channels";
import { SCENARIOS, TONES } from "../scenarios";
import { createPublishTask, registerAdapter, executePublish, getTask, batchPublish } from "../publisher";
import { CHANNEL_TEMPLATES, validateContent, getChannelTemplate } from "../templates";
import type { ChannelId } from "../types";
import type { PublishAdapter } from "../publisher";

describe("publish-service", () => {

  // ========== 渠道配置 ==========
  describe("渠道配置", () => {
    it("应该有 5 个渠道：douyin/moments/58city/xiaohongshu/wechat", () => {
      expect(CHANNEL_IDS).toHaveLength(5);
      const expected: ChannelId[] = ["douyin", "moments", "58city", "xiaohongshu", "wechat"];
      for (const id of expected) {
        expect(CHANNELS[id]).toBeDefined();
        expect(CHANNELS[id].name).toBeTruthy();
      }
    });

    it("每个渠道必须有完整的格式规则和调性提示", () => {
      for (const ch of CHANNEL_LIST) {
        expect(ch.formatRules.length).toBeGreaterThan(10);
        expect(ch.toneHint.length).toBeGreaterThan(3);
        expect(ch.maxTextLength).toBeGreaterThan(0);
      }
    });

    it("抖音渠道：9:16 竖屏 + 300字限制 + 1张配图", () => {
      const dy = CHANNELS.douyin;
      expect(dy.imageAspect).toBe("9:16");
      expect(dy.maxTextLength).toBe(300);
      expect(dy.imageCount).toBe(1);
    });

    it("小红书渠道：3:4 比例 + 最多9张图", () => {
      const xhs = CHANNELS.xiaohongshu;
      expect(xhs.imageAspect).toBe("3:4");
      expect(xhs.imageCount).toBe(9);
    });
  });

  // ========== 发布模板 ==========
  describe("发布模板", () => {
    it("每个渠道都有对应模板", () => {
      for (const id of CHANNEL_IDS) {
        const tpl = getChannelTemplate(id);
        expect(tpl).toBeDefined();
        expect(tpl.structure.length).toBeGreaterThan(10);
        expect(tpl.example.length).toBeGreaterThan(20);
      }
    });

    it("抖音模板：标签不足5个应报错", () => {
      const result = validateContent("douyin", "文案内容没有标签");
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("标签"))).toBe(true);
    });

    it("抖音模板：超过300字应报错", () => {
      const longText = "a".repeat(301);
      const result = validateContent("douyin", longText);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("字数"))).toBe(true);
    });

    it("抖音模板：合规内容应通过", () => {
      const good = "好阿姨来了\n做饭好\n干净利落\n快来\n#标签1 #标签2 #标签3 #标签4 #标签5";
      const result = validateContent("douyin", good);
      expect(result.valid).toBe(true);
    });

    it("58同城模板：缺少结构化字段应报错", () => {
      const result = validateContent("58city", "随便写的招聘信息");
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("【职位名称】"))).toBe(true);
    });

    it("58同城模板：完整格式应通过", () => {
      const good = "【职位名称】保姆\n【薪资待遇】6000\n【工作地点】朝阳\n【岗位职责】做饭\n【任职要求】有经验";
      const result = validateContent("58city", good);
      expect(result.valid).toBe(true);
    });

    it("小红书模板：emoji不足应报错", () => {
      const result = validateContent("xiaohongshu", "标题\n正文没有emoji\n#1 #2 #3 #4 #5 #6 #7 #8");
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("emoji"))).toBe(true);
    });

    it("微信公众号模板：标题超长应报错", () => {
      const longTitle = "这是一个非常非常非常非常非常非常非常非常长的公众号标题不应该通过验证的";
      const result = validateContent("wechat", longTitle + "\n正文");
      expect(result.valid).toBe(false);
      expect(result.errors.some((e) => e.includes("标题"))).toBe(true);
    });
  });

  // ========== 发布任务管理 ==========
  describe("发布任务生命周期", () => {
    it("创建 → 查询 → 执行 完整流程", async () => {
      registerAdapter({
        channelId: "moments",
        publish: async () => ({ success: true, url: "https://wx.com/123" }),
        validate: () => ({ valid: true, errors: [] }),
      });

      const task = createPublishTask("moments", "朋友圈测试文案");
      expect(task.status).toBe("draft");

      const found = getTask(task.id);
      expect(found?.id).toBe(task.id);

      const result = await executePublish(task.id);
      expect(result.status).toBe("published");
      expect(result.publishedAt).toBeGreaterThan(0);
    });

    it("定时任务应为 scheduled 状态", () => {
      const future = Date.now() + 3600000;
      const task = createPublishTask("douyin", "定时发布", [], future);
      expect(task.status).toBe("scheduled");
    });

    it("发布失败应记录 retryCount", async () => {
      registerAdapter({
        channelId: "xiaohongshu",
        publish: async () => ({ success: false, error: "网络超时" }),
        validate: () => ({ valid: true, errors: [] }),
      });

      const task = createPublishTask("xiaohongshu", "会失败的文案");
      const result = await executePublish(task.id);
      expect(result.status).toBe("failed");
      expect(result.retryCount).toBe(1);
      expect(result.error).toContain("网络超时");
    });
  });

  // ========== 场景与语气 ==========
  describe("场景与语气", () => {
    it("每个场景都有样本需求和技能要求", () => {
      for (const s of SCENARIOS) {
        expect(s.sampleRequirement.length).toBeGreaterThan(10);
        expect(s.requiredSkills.length).toBeGreaterThan(0);
      }
    });

    it("每种语气都有适用场景描述", () => {
      for (const t of TONES) {
        expect(t.description).toContain("适合");
      }
    });
  });
});
