"use client";

import Link from "next/link";
import { GlassCard } from "@/components/layout/GlassCard";
import { useRecruitStore, type RecruitTask, type TaskStatus } from "@/stores/recruitStore";
import { CHANNELS, CHANNEL_IDS, type ChannelId } from "@modules/publish-service";
import { ChannelIcon } from "@/components/icons/ChannelIcon";
import { Plus, Search, Filter, Trash2, ExternalLink, Copy, CheckCircle2, Clock, AlertCircle, Sparkles, PenLine, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; icon: typeof Clock }> = {
  draft: { label: "草稿", color: "text-slate-500 bg-slate-50", icon: Clock },
  generating: { label: "生成中", color: "text-amber-600 bg-amber-50", icon: Sparkles },
  ready: { label: "待发布", color: "text-blue-600 bg-blue-50", icon: PenLine },
  publishing: { label: "发布中", color: "text-purple-600 bg-purple-50", icon: Send },
  published: { label: "已发布", color: "text-emerald-600 bg-emerald-50", icon: CheckCircle2 },
  failed: { label: "失败", color: "text-red-600 bg-red-50", icon: AlertCircle },
};

function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", cfg.color)}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function ChannelStatusDot({ status }: { status: TaskStatus }) {
  const colorMap: Record<TaskStatus, string> = {
    draft: "bg-slate-300",
    generating: "bg-amber-400 animate-pulse",
    ready: "bg-blue-400",
    publishing: "bg-purple-400 animate-pulse",
    published: "bg-emerald-500",
    failed: "bg-red-500",
  };
  return <span className={cn("block h-2 w-2 rounded-full", colorMap[status])} />;
}

function getOverallStatus(task: RecruitTask): TaskStatus {
  const statuses = Object.values(task.channels).map((c) => c.status);
  if (statuses.every((s) => s === "published")) return "published";
  if (statuses.some((s) => s === "generating")) return "generating";
  if (statuses.some((s) => s === "publishing")) return "publishing";
  if (statuses.some((s) => s === "failed")) return "failed";
  if (statuses.some((s) => s === "ready")) return "ready";
  return "draft";
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/8">
        <PenLine size={28} className="text-brand" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold">还没有招募任务</h3>
      <p className="mt-1 text-sm text-muted-foreground">点击「新建招募」开始生成你的第一条多渠道招聘文案</p>
      <Link href="/generate" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark active:scale-[0.98]">
        <Plus size={16} />
        新建招募
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const { tasks, removeTask, selectTask } = useRecruitStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all");

  const filtered = tasks.filter((t) => {
    if (search && !t.title.includes(search) && !t.requirement.includes(search)) return false;
    if (filterStatus !== "all" && getOverallStatus(t) !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: tasks.length,
    published: tasks.filter((t) => getOverallStatus(t) === "published").length,
    ready: tasks.filter((t) => getOverallStatus(t) === "ready").length,
    generating: tasks.filter((t) => getOverallStatus(t) === "generating").length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">招募中心</h1>
          <p className="text-sm text-muted-foreground">管理所有招募任务，一键生成并批量发布到各渠道</p>
        </div>
        <Link href="/generate" className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-brand-dark active:scale-[0.98]">
          <Plus size={15} />
          新建招募
        </Link>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "总任务", value: stats.total, color: "text-slate-700" },
          { label: "已发布", value: stats.published, color: "text-emerald-600" },
          { label: "待发布", value: stats.ready, color: "text-blue-600" },
          { label: "生成中", value: stats.generating, color: "text-amber-600" },
        ].map((s) => (
          <GlassCard key={s.label} className="!p-3.5">
            <p className="text-[11px] font-medium text-muted-foreground">{s.label}</p>
            <p className={cn("mt-0.5 text-2xl font-bold tracking-tight", s.color)}>{s.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* 搜索和筛选 */}
      <GlassCard className="!p-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-white/80 px-3 py-1.5 ring-1 ring-border/50">
            <Search size={14} className="text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索任务名称或需求..."
              className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="flex items-center gap-1">
            <Filter size={13} className="text-muted-foreground" />
            {(["all", "ready", "published", "generating", "failed"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn("rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                  filterStatus === s ? "bg-brand/10 text-brand" : "text-muted-foreground hover:bg-muted/60"
                )}
              >
                {s === "all" ? "全部" : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* 任务表格 */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <GlassCard className="!p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40 bg-white/60 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">任务</th>
                <th className="px-4 py-3">状态</th>
                {CHANNEL_IDS.map((id) => (
                  <th key={id} className="px-2 py-3 text-center">
                    <div className="flex flex-col items-center gap-0.5">
                      <ChannelIcon channelId={id} size={14} />
                      <span className="text-[9px]">{CHANNELS[id].name}</span>
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center">时间</th>
                <th className="px-4 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => {
                const overall = getOverallStatus(task);
                return (
                  <tr key={task.id} className="group border-b border-border/20 transition-colors hover:bg-white/40">
                    <td className="px-4 py-3">
                      <div className="max-w-[220px]">
                        <p className="truncate text-[13px] font-semibold">{task.title || "未命名招募"}</p>
                        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{task.requirement.slice(0, 50)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={overall} />
                    </td>
                    {CHANNEL_IDS.map((id) => (
                      <td key={id} className="px-2 py-3 text-center">
                        {task.channels[id] ? (
                          <div className="flex justify-center">
                            <ChannelStatusDot status={task.channels[id].status} />
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground/30">-</span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center text-[11px] text-muted-foreground">
                      {new Date(task.createdAt).toLocaleDateString("zh-CN", { month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Link href="/generate" className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground" title="编辑">
                          <PenLine size={13} />
                        </Link>
                        <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground" title="复制">
                          <Copy size={13} />
                        </button>
                        <button onClick={() => removeTask(task.id)} className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500" title="删除">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
}
