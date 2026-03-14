"use client";

import { CHANNELS } from "@modules/publish-service";
import { ChannelIcon } from "@/components/icons/ChannelIcon";
import { Copy, Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import type { ChannelId } from "@/types";

interface Props { channelId: ChannelId; content: string; status: "idle" | "generating" | "done" | "error"; onContentChange: (v: string) => void }

export function ContentEditor({ channelId, content, status, onContentChange }: Props) {
  const ch = CHANNELS[channelId];
  const [copied, setCopied] = useState(false);

  async function handleCopy() { if (!content) return; await navigator.clipboard.writeText(content); setCopied(true); setTimeout(() => setCopied(false), 2000); }

  const pct = Math.min(100, (content.length / ch.maxTextLength) * 100);
  const over = content.length > ch.maxTextLength;

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2.5">
          <ChannelIcon channelId={channelId} size={15} />
          <span className="text-[13px] font-semibold">{ch.name} 文案</span>
          {status === "generating" && <span className="flex items-center gap-1.5 rounded-full bg-brand/8 px-2.5 py-0.5 text-[10px] font-medium text-brand"><span className="h-1 w-1 animate-pulse rounded-full bg-brand" />AI 生成中</span>}
          {status === "done" && <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-medium text-emerald-600">已完成</span>}
        </div>
        <div className="flex items-center gap-1.5">
          {content && <button onClick={() => onContentChange("")} className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted/60 hover:text-foreground"><RotateCcw size={12} />清空</button>}
          <button onClick={handleCopy} disabled={!content} className={cn("flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors", copied ? "bg-emerald-50 text-emerald-600" : "text-muted-foreground hover:bg-muted/60", !content && "cursor-not-allowed opacity-30")}>
            {copied ? <Check size={12} /> : <Copy size={12} />}{copied ? "已复制" : "复制"}
          </button>
        </div>
      </div>
      <div className={cn("relative flex-1 flex flex-col rounded-xl border bg-white transition-colors", status === "generating" ? "border-brand/20 shadow-sm" : "border-border", "focus-within:border-brand/40 focus-within:ring-4 focus-within:ring-brand/5 focus-within:shadow-sm")}>
        {status === "generating" && <div className="absolute top-3 right-3"><span className="inline-block h-4 w-1 animate-pulse bg-brand" /></div>}
        <textarea value={content} onChange={(e) => onContentChange(e.target.value)}
          placeholder={status === "idle" ? `点击「一键生成」\nAI 将为 ${ch.name} 生成专属文案...` : ""}
          className="flex-1 w-full resize-none rounded-t-xl bg-transparent p-4 text-[13px] leading-relaxed outline-none placeholder:text-muted-foreground/35"
          readOnly={status === "generating"} />
        {content && (
          <div className="flex shrink-0 items-center justify-between border-t border-border/50 px-4 py-2 bg-gray-50/50 rounded-b-xl">
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full transition-all duration-500", over ? "bg-red-400" : pct > 80 ? "bg-amber-400" : "bg-brand/70")} style={{ width: `${Math.min(100, pct)}%` }} /></div>
              <span className={cn("text-[11px] tabular-nums", over ? "font-medium text-red-500" : "text-muted-foreground")}>{content.length} / {ch.maxTextLength} 字</span>
            </div>
            <span className="text-[11px] text-muted-foreground/50">可直接编辑修改</span>
          </div>
        )}
      </div>
    </div>
  );
}
