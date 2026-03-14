import { describe, it, expect, beforeEach } from "vitest";
import { addLog, getLogs, getStats } from "../logger";

describe("logger", () => {
  describe("日志记录", () => {
    it("addLog 应返回带 id 和 timestamp 的完整日志", () => {
      const entry = addLog({
        route: "/api/test",
        model: "test-model",
        durationMs: 100,
        success: true,
      });
      expect(entry).not.toBeNull();
      expect(entry!.id).toBeTruthy();
      expect(entry!.timestamp).toBeGreaterThan(0);
      expect(entry!.route).toBe("/api/test");
    });

    it("getLogs 应返回所有日志的副本", () => {
      addLog({ route: "/api/a", model: "m", durationMs: 50, success: true });
      const logs = getLogs();
      expect(logs.length).toBeGreaterThan(0);
      expect(Array.isArray(logs)).toBe(true);
    });

    it("新日志应在列表最前面", () => {
      addLog({ route: "/api/old", model: "m", durationMs: 50, success: true });
      addLog({ route: "/api/new", model: "m", durationMs: 50, success: true });
      const logs = getLogs();
      expect(logs[0].route).toBe("/api/new");
    });
  });

  describe("统计", () => {
    it("getStats 应返回正确的统计结构", () => {
      addLog({ route: "/api/stat", model: "m", durationMs: 100, success: true, totalTokens: 500 });
      addLog({ route: "/api/stat", model: "m", durationMs: 200, success: false, error: "timeout" });

      const stats = getStats();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.successful).toBeGreaterThanOrEqual(0);
      expect(stats.failed).toBeGreaterThanOrEqual(0);
      expect(stats.total).toBe(stats.successful + stats.failed);
      expect(typeof stats.avgDuration).toBe("number");
      expect(typeof stats.byRoute).toBe("object");
    });
  });
});
