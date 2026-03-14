"use client";

import { useState } from "react";
import { useGenerateStore } from "@/stores/generateStore";
import { ChannelPreview } from "@/components/generate/ChannelPreview";
import { ContentEditor } from "@/components/generate/ContentEditor";
import { CHANNEL_LIST } from "@modules/publish-service";
import { ChannelIcon } from "@/components/icons/ChannelIcon";
import { PenLine, X, Image, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChannelId } from "@/types";

export default function ChannelPage() {
  const { contents, images, statuses, imageStatuses, updateContent } = useGenerateStore();
  const [editingChannel, setEditingChannel] = useState<ChannelId | null>(null);

  const editing = editingChannel ? {
    ch: CHANNEL_LIST.find((c) => c.id === editingChannel)!,
    content: contents[editingChannel],
    status: statuses[editingChannel],
    imgs: images[editingChannel],
    imgStatus: imageStatuses[editingChannel],
  } : null;

  return (
    <div className="flex h-full gap-4">
      {/* 左侧：渠道卡片网格 */}
      <div className={cn("flex-1 overflow-y-auto", editing ? "max-w-[55%]" : "")}>
        <div className={cn("grid gap-3 pb-4", editing ? "grid-cols-1" : "grid-cols-2 xl:grid-cols-3")}>
          {CHANNEL_LIST.map((ch) => {
            const img = images[ch.id]?.[0];
            const st = statuses[ch.id];
            const imgSt = imageStatuses[ch.id];
            const isActive = editingChannel === ch.id;
            const hasContent = contents[ch.id].length > 0;
            const imgCount = images[ch.id]?.length ?? 0;

            return (
              <div
                key={ch.id}
                onClick={() => setEditingChannel(isActive ? null : ch.id)}
                className={cn(
                  "glass-card cursor-pointer overflow-hidden rounded-2xl p-0 transition-all",
                  isActive ? "ring-2 ring-brand/30 shadow-md" : "hover:shadow-md hover:-translate-y-0.5",
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/30 bg-white/60 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <ChannelIcon channelId={ch.id} size={15} />
                    <span className="text-[13px] font-bold">{ch.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {st === "generating" && (
                      <span className="flex items-center gap-1 rounded-full bg-brand/8 px-2 py-0.5 text-[10px] font-medium text-brand">
                        <span className="h-1 w-1 animate-pulse rounded-full bg-brand" />生成中
                      </span>
                    )}
                    {st === "done" && <CheckCircle2 size={14} className="text-emerald-500" />}
                    {imgSt === "generating" && (
                      <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-500">
                        <Image size={9} />配图中
                      </span>
                    )}
                    {imgCount > 0 && imgSt === "done" && (
                      <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[9px] font-medium text-blue-500">
                        {imgCount}图
                      </span>
                    )}
                  </div>
                </div>

                {/* Preview (compact) */}
                <div className="p-3">
                  {hasContent ? (
                    <div className="space-y-2">
                      <p className="line-clamp-3 text-[11px] leading-relaxed text-slate-600">
                        {contents[ch.id].slice(0, 120)}...
                      </p>
                      {imgCount > 0 && (
                        <div className="flex gap-1.5">
                          {images[ch.id].slice(0, 3).map((url, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={i} src={url} alt="" className="h-12 w-12 rounded-md border border-border/30 object-cover" />
                          ))}
                          {imgCount > 3 && (
                            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-muted/60 text-[10px] font-medium text-muted-foreground">
                              +{imgCount - 3}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] tabular-nums text-muted-foreground">
                          {contents[ch.id].length}/{ch.maxTextLength}字
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-medium text-brand">
                          <PenLine size={10} />点击编辑
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-6 text-[11px] text-muted-foreground/40">
                      {st === "idle" ? "等待生成" : st === "generating" ? "AI 正在生成..." : "生成失败"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 右侧：展开的编辑器 + 预览 */}
      {editing && (
        <div className="flex w-[45%] shrink-0 flex-col gap-3 overflow-hidden animate-fade-in-scale">
          {/* 编辑器面板 */}
          <div className="glass-card flex flex-1 flex-col overflow-hidden rounded-2xl p-0">
            <div className="flex items-center justify-between border-b border-border/30 bg-white/60 px-5 py-3">
              <div className="flex items-center gap-2">
                <ChannelIcon channelId={editing.ch.id} size={16} />
                <span className="text-[14px] font-bold">{editing.ch.name} 编辑</span>
              </div>
              <button onClick={() => setEditingChannel(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground">
                <X size={16} />
              </button>
            </div>

            {/* 预览 */}
            <div className="overflow-y-auto border-b border-border/20 bg-gradient-to-b from-slate-50/80 to-slate-100/40 p-5">
              <div className="flex justify-center" style={{ zoom: 0.75 }}>
                <ChannelPreview channelId={editing.ch.id} content={editing.content} image={editing.imgs?.[0]} />
              </div>
            </div>

            {/* 编辑器 */}
            <div className="flex-1 overflow-y-auto bg-white/80 p-4">
              <ContentEditor
                channelId={editing.ch.id}
                content={editing.content}
                status={editing.status}
                images={editing.imgs}
                imageStatus={editing.imgStatus}
                onContentChange={(v) => updateContent(editing.ch.id, v)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
