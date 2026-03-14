"use client";

import { CHANNEL_LIST } from "@modules/publish-service";
import { ChannelIcon, CHANNEL_COLORS } from "@/components/icons/ChannelIcon";
import { Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { ChannelId } from "@/types";

type Status = "idle" | "generating" | "done" | "error";

interface Props {
  contents: Record<ChannelId, string>;
  statuses: Record<ChannelId, Status>;
  images: Record<ChannelId, string[]>;
}

export function BatchPublishTable({ contents, statuses, images }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(id: ChannelId) {
    if (!contents[id]) return;
    await navigator.clipboard.writeText(contents[id]);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const hasAny = Object.values(contents).some((c) => c.length > 0);
  if (!hasAny) return null;

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[13px] font-bold">批量发布管理</h3>
        <span className="text-[11px] text-muted-foreground">
          {Object.values(statuses).filter((s) => s === "done").length} / {CHANNEL_LIST.length} 渠道已完成
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-border/60">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="border-b border-border/40 bg-muted/30">
              <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">渠道</th>
              <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">状态</th>
              <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">文案预览</th>
              <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">配图</th>
              <th className="px-3 py-2.5 text-left font-semibold text-muted-foreground">字数</th>
              <th className="px-3 py-2.5 text-right font-semibold text-muted-foreground">操作</th>
            </tr>
          </thead>
          <tbody>
            {CHANNEL_LIST.map((ch) => {
              const st = statuses[ch.id];
              const txt = contents[ch.id];
              const img = images[ch.id]?.[0];
              const isCopied = copiedId === ch.id;

              return (
                <tr key={ch.id} className="border-b border-border/20 last:border-b-0 hover:bg-muted/20 transition-colors">
                  {/* Channel */}
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <ChannelIcon channelId={ch.id} size={14} />
                      <span className={cn("font-medium", CHANNEL_COLORS[ch.id])}>{ch.name}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2.5">
                    {st === "idle" && <span className="text-muted-foreground/50">待生成</span>}
                    {st === "generating" && (
                      <span className="flex items-center gap-1 text-brand">
                        <Loader2 size={11} className="animate-spin" />生成中
                      </span>
                    )}
                    {st === "done" && <span className="text-emerald-600 font-medium">已完成</span>}
                    {st === "error" && <span className="text-red-500">失败</span>}
                  </td>

                  {/* Preview */}
                  <td className="max-w-[280px] px-3 py-2.5">
                    <p className="truncate text-muted-foreground">
                      {txt ? txt.slice(0, 60) + (txt.length > 60 ? "..." : "") : "—"}
                    </p>
                  </td>

                  {/* Image */}
                  <td className="px-3 py-2.5">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt="" className="h-8 w-8 rounded border border-border object-cover" />
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>

                  {/* Word count */}
                  <td className="px-3 py-2.5 tabular-nums text-muted-foreground">
                    {txt ? `${txt.length}/${ch.maxTextLength}` : "—"}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleCopy(ch.id)}
                        disabled={!txt}
                        className={cn(
                          "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
                          isCopied ? "bg-emerald-50 text-emerald-600" : "hover:bg-muted/60 text-muted-foreground",
                          !txt && "opacity-30 cursor-not-allowed"
                        )}
                      >
                        {isCopied ? <><Check size={11} />已复制</> : <><Copy size={11} />复制</>}
                      </button>
                      <button
                        disabled={!txt}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-brand hover:bg-brand/5 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ExternalLink size={11} />发布
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
