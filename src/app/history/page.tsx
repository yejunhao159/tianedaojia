"use client";

import { useHistoryStore, type HistoryType } from "@/stores/historyStore";
import { GlassCard } from "@/components/layout/GlassCard";
import { PenLine, Layers3, Target, Trash2, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";

const TYPE_META: Record<HistoryType, { label: string; Icon: React.ElementType; gradient: string }> = {
  generate: { label: "文案生成", Icon: PenLine, gradient: "from-red-500 to-orange-500" },
  parse: { label: "信息结构化", Icon: Layers3, gradient: "from-red-500 to-pink-500" },
  match: { label: "智能匹配", Icon: Target, gradient: "from-red-600 to-purple-600" },
};

function formatTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - ts;

  if (diff < 60_000) return "刚刚";
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)} 分钟前`;
  if (diff < 86400_000) return `${Math.floor(diff / 3600_000)} 小时前`;
  if (d.toDateString() === new Date(now.getTime() - 86400_000).toDateString()) return "昨天";
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function HistoryPage() {
  const { entries, removeEntry, clearAll } = useHistoryStore();
  const [filter, setFilter] = useState<HistoryType | "all">("all");

  const filtered = filter === "all" ? entries : entries.filter((e) => e.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">历史记录</h1>
          <p className="text-sm text-muted-foreground">查看 AI 生成、解析和匹配的历史记录</p>
        </div>
        {entries.length > 0 && (
          <button onClick={clearAll}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600">
            <Trash2 size={14} />清空全部
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "generate", "parse", "match"] as const).map((t) => {
          const active = filter === t;
          const label = t === "all" ? "全部" : TYPE_META[t].label;
          const count = t === "all" ? entries.length : entries.filter((e) => e.type === t).length;
          return (
            <button key={t} onClick={() => setFilter(t)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all ${active ? "bg-brand text-white shadow-sm" : "border border-border bg-white text-muted-foreground hover:border-brand/20"}`}>
              {label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${active ? "bg-white/20" : "bg-muted"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* History list */}
      {filtered.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center py-16 text-center">
          <Clock size={40} className="mb-4 text-muted-foreground/30" />
          <p className="text-[14px] font-medium text-muted-foreground/60">暂无历史记录</p>
          <p className="text-[12px] text-muted-foreground/40">使用 AI 功能后，记录将自动保存在这里</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => {
            const meta = TYPE_META[entry.type];
            const Icon = meta.Icon;
            return (
              <GlassCard key={entry.id} className="group flex items-start gap-4 transition-all hover:shadow-md">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white`}>
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-brand/6 px-2 py-0.5 text-[10px] font-semibold text-brand">{meta.label}</span>
                    <span className="text-[11px] text-muted-foreground">{formatTime(entry.timestamp)}</span>
                  </div>
                  <p className="mt-1 truncate text-[14px] font-semibold">{entry.title || "未命名"}</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">{entry.summary}</p>
                </div>
                <button onClick={() => removeEntry(entry.id)}
                  className="shrink-0 rounded-lg p-2 text-muted-foreground/40 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
                  <Trash2 size={14} />
                </button>
              </GlassCard>
            );
          })}
        </div>
      )}

      {entries.length > 0 && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50/80 px-4 py-3 text-[12px] text-amber-700">
          <AlertTriangle size={14} />
          <span>历史记录保存在浏览器本地存储中，清除浏览器数据将删除所有记录</span>
        </div>
      )}
    </div>
  );
}
