"use client";

import { useState } from "react";
import { GlassCard } from "@/components/layout/GlassCard";
import { CHANNEL_TEMPLATES, CHANNELS, CHANNEL_IDS, validateContent } from "@modules/publish-service";
import { ChannelIcon, CHANNEL_COLORS } from "@/components/icons/ChannelIcon";
import { useRecruitStore } from "@/stores/recruitStore";
import { Send, CheckCircle2, AlertCircle, Loader2, FileText, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChannelId } from "@modules/publish-service";

type PublishResult = { channelId: string; status: string; error?: string };

export default function PublishPage() {
  const { tasks } = useRecruitStore();
  const [publishing, setPublishing] = useState(false);
  const [results, setResults] = useState<PublishResult[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const readyTasks = tasks.filter((t) =>
    Object.values(t.channels).some((c) => c.text?.length > 0)
  );
  const selectedTask = readyTasks.find((t) => t.id === selectedTaskId);

  const handlePublish = async (taskId: string) => {
    const task = readyTasks.find((t) => t.id === taskId);
    if (!task) return;

    setPublishing(true);
    setResults([]);

    const channels = CHANNEL_IDS
      .filter((id) => task.channels[id]?.text?.length > 0)
      .map((id) => ({
        channelId: id,
        content: task.channels[id].text,
        imageUrls: task.channels[id].imageUrl ? [task.channels[id].imageUrl!] : [],
      }));

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channels }),
      });
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setResults([{ channelId: "all", status: "failed", error: "网络错误" }]);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">发布管理</h1>
        <p className="text-sm text-muted-foreground">选择招募任务，一键批量发布到所有渠道</p>
      </div>

      {/* 待发布任务列表 */}
      <GlassCard>
        <h3 className="mb-3 text-[13px] font-bold">待发布任务 ({readyTasks.length})</h3>
        {readyTasks.length === 0 ? (
          <p className="py-6 text-center text-[12px] text-muted-foreground/50">暂无待发布的招募任务，请先在「文案生成」页生成并保存</p>
        ) : (
          <div className="space-y-2">
            {readyTasks.map((task) => {
              const channelCount = CHANNEL_IDS.filter((id) => task.channels[id]?.text?.length > 0).length;
              const isSelected = selectedTaskId === task.id;
              return (
                <div key={task.id} onClick={() => setSelectedTaskId(isSelected ? null : task.id)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all",
                    isSelected ? "border-brand/30 bg-brand/5" : "border-border/30 hover:bg-muted/30"
                  )}>
                  <div>
                    <p className="text-[13px] font-semibold">{task.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{channelCount} 个渠道有内容</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(task.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                    {isSelected && (
                      <button onClick={(e) => { e.stopPropagation(); handlePublish(task.id); }}
                        disabled={publishing}
                        className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-brand-dark disabled:opacity-50">
                        {publishing ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                        {publishing ? "发布中..." : "批量发布"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {/* 发布结果 */}
      {results.length > 0 && (
        <GlassCard>
          <h3 className="mb-3 text-[13px] font-bold">发布结果</h3>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-border/20 px-3 py-2">
                <div className="flex items-center gap-2">
                  <ChannelIcon channelId={r.channelId as ChannelId} size={14} />
                  <span className="text-[12px] font-medium">{CHANNELS[r.channelId as ChannelId]?.name ?? r.channelId}</span>
                </div>
                {r.status === "published" ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <CheckCircle2 size={12} />已发布
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-red-500">
                    <AlertCircle size={12} />{r.error ?? "失败"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* 渠道模板 */}
      <div>
        <h3 className="mb-3 text-[14px] font-bold">渠道模板与校验规则</h3>
        <div className="grid grid-cols-2 gap-3">
          {CHANNEL_IDS.map((id) => {
            const ch = CHANNELS[id];
            const tpl = CHANNEL_TEMPLATES[id];
            return (
              <GlassCard key={id} className="space-y-2 !p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChannelIcon channelId={id} size={14} />
                    <span className={cn("text-[12px] font-bold", CHANNEL_COLORS[id])}>{ch.name}</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground">{ch.maxTextLength}字 | {ch.imageAspect}</span>
                </div>
                <pre className="whitespace-pre-wrap text-[10px] leading-relaxed text-slate-500">{tpl.structure}</pre>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
