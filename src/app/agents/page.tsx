"use client";

import { GlassCard } from "@/components/layout/GlassCard";
import { AGENTS } from "@modules/agent-server";
import { Bot, Sparkles, PenLine, ShieldCheck, Image } from "lucide-react";

const ICONS: Record<string, typeof Bot> = {
  analyzer: Sparkles,
  copywriter: PenLine,
  reviewer: ShieldCheck,
  imageDirector: Image,
};

export default function AgentsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">智能体</h1>
        <p className="text-sm text-muted-foreground">AI Agent 编排与管理，子代理协作完成复杂任务</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.values(AGENTS).map((agent) => {
          const Icon = ICONS[agent.id] ?? Bot;
          return (
            <GlassCard key={agent.id} hover index={0} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/8">
                  <Icon size={20} className="text-brand" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold">{agent.name}</h3>
                  <p className="text-[11px] text-muted-foreground">Temperature: {agent.temperature}</p>
                </div>
              </div>
              <p className="text-[12px] leading-relaxed text-muted-foreground whitespace-pre-line">
                {agent.systemPrompt.split("\n").slice(0, 3).join("\n")}
              </p>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-brand/6 px-2 py-0.5 text-[10px] font-medium text-brand">{agent.role}</span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="space-y-3">
        <h3 className="text-[14px] font-bold">文案生成 Pipeline</h3>
        <div className="flex items-center gap-2">
          {Object.values(AGENTS).map((agent, i) => {
            const Icon = ICONS[agent.id] ?? Bot;
            return (
              <div key={agent.id} className="flex items-center gap-2">
                {i > 0 && <span className="text-muted-foreground/30">→</span>}
                <div className="flex items-center gap-1.5 rounded-lg bg-white/80 px-3 py-1.5 ring-1 ring-border/30">
                  <Icon size={13} className="text-brand" />
                  <span className="text-[11px] font-medium">{agent.name}</span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-foreground">需求分析 → 文案生成 → 质量审核 → 配图指导，四步 Agent 链式协作</p>
      </GlassCard>
    </div>
  );
}
