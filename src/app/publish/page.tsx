"use client";

import { GlassCard } from "@/components/layout/GlassCard";
import { CHANNEL_TEMPLATES, CHANNELS, CHANNEL_IDS } from "@modules/publish-service";
import { ChannelIcon } from "@/components/icons/ChannelIcon";
import { Send, CheckCircle2, FileText } from "lucide-react";

export default function PublishPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">发布管理</h1>
        <p className="text-sm text-muted-foreground">多渠道发布模板与批量发布管理</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {CHANNEL_IDS.map((id) => {
          const ch = CHANNELS[id];
          const tpl = CHANNEL_TEMPLATES[id];
          return (
            <GlassCard key={id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ChannelIcon channelId={id} size={20} />
                  <div>
                    <h3 className="text-[14px] font-bold">{ch.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{ch.toneHint}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <FileText size={12} />
                  <span>{ch.maxTextLength} 字</span>
                  <span className="mx-1 text-border">|</span>
                  <span>{ch.imageAspect}</span>
                  <span className="mx-1 text-border">|</span>
                  <span>{ch.imageCount} 图</span>
                </div>
              </div>

              <div className="rounded-xl bg-white/60 p-4">
                <p className="mb-2 text-[11px] font-semibold text-muted-foreground">模板结构</p>
                <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-slate-600">{tpl.structure}</pre>
              </div>

              <details className="group">
                <summary className="cursor-pointer text-[11px] font-medium text-brand hover:text-brand-dark">
                  查看示例文案
                </summary>
                <div className="mt-2 rounded-xl bg-slate-50/80 p-4">
                  <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-slate-600">{tpl.example}</pre>
                </div>
              </details>

              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                  <CheckCircle2 size={10} className="mr-0.5 inline" />
                  自动校验
                </span>
                <span className="text-[10px] text-muted-foreground">{ch.formatRules.slice(0, 60)}...</span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
