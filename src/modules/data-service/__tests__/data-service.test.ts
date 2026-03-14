import { describe, it, expect } from "vitest";
import { parseTextInput, parseWechatChat } from "../parsers";
import { normalizeWhitespace, deduplicateByContent, filterEmpty } from "../cleaners";
import { runPipeline } from "../pipeline";
import type { RawDataInput } from "../types";

describe("data-service", () => {
  describe("文本解析器", () => {
    it("应该按行拆分文本", () => {
      const input: RawDataInput = { source: "text", content: "行1\n行2\n行3" };
      const records = parseTextInput(input);
      expect(records).toHaveLength(3);
      expect(records[0].fields.raw).toBe("行1");
    });

    it("应该跳过空行", () => {
      const input: RawDataInput = { source: "text", content: "行1\n\n\n行2" };
      const records = parseTextInput(input);
      expect(records).toHaveLength(2);
    });
  });

  describe("微信聊天解析器", () => {
    it("应该解析 sender: content 格式", () => {
      const input: RawDataInput = {
        source: "wechat_chat",
        content: "张阿姨：我会做川菜\n雇主：薪资多少",
      };
      const records = parseWechatChat(input);
      expect(records).toHaveLength(2);
      expect(records[0].fields.sender).toBe("张阿姨");
      expect(records[0].fields.content).toBe("我会做川菜");
    });

    it("无法匹配时应回退到文本解析", () => {
      const input: RawDataInput = { source: "wechat_chat", content: "随便一段话" };
      const records = parseWechatChat(input);
      expect(records.length).toBeGreaterThan(0);
    });
  });

  describe("清洗步骤", () => {
    it("normalizeWhitespace 应规范化空白", () => {
      const records = [{ id: "1", fields: { raw: "  多   空格  " }, confidence: 1, source: "text" as const, warnings: [], rawSnippet: "" }];
      const cleaned = normalizeWhitespace.execute(records);
      expect(cleaned[0].fields.raw).toBe("多 空格");
    });

    it("deduplicateByContent 应去重", () => {
      const r = { id: "1", fields: { raw: "相同" }, confidence: 1, source: "text" as const, warnings: [], rawSnippet: "" };
      const cleaned = deduplicateByContent.execute([r, { ...r, id: "2" }]);
      expect(cleaned).toHaveLength(1);
    });

    it("filterEmpty 应过滤空记录", () => {
      const records = [
        { id: "1", fields: { raw: "有内容" }, confidence: 1, source: "text" as const, warnings: [], rawSnippet: "" },
        { id: "2", fields: { raw: "" }, confidence: 0, source: "text" as const, warnings: [], rawSnippet: "" },
      ];
      const cleaned = filterEmpty.execute(records);
      expect(cleaned).toHaveLength(1);
    });
  });

  describe("完整 Pipeline", () => {
    it("应该执行解析 + 清洗 + 返回统计", () => {
      const input: RawDataInput = {
        source: "text",
        content: "张阿姨 48岁\n  \n张阿姨 48岁\n李阿姨 35岁",
      };
      const result = runPipeline(input);
      expect(result.stats.inputCount).toBeGreaterThanOrEqual(3);
      expect(result.stats.outputCount).toBeLessThanOrEqual(3);
      expect(result.stats.stepsApplied.length).toBe(3);
      expect(result.stats.avgConfidence).toBeGreaterThan(0);
    });
  });
});
