"use client";

import { useState } from "react";
import { useGenerateStore } from "@/stores/generateStore";
import { ChannelPreview } from "@/components/generate/ChannelPreview";
import { ContentEditor } from "@/components/generate/ContentEditor";
import { CHANNEL_LIST, CHANNELS } from "@modules/publish-service";
import { ChannelIcon, CHANNEL_COLORS } from "@/components/icons/ChannelIcon";
import { PenLine, X, CheckCircle2, Loader2, Image, AlertCircle } from "lucide-react";
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
      <div className={cn("flex-1 min-h-0", editing ? "max-w-[50%]" : "")}>
        <div className={cn(
          "grid h-full gap-3",
          editing ? "grid-cols-2 grid-rows-3" : "grid-cols-3 grid-rows-2"
        )}>
          {CHANNEL_LIST.map((ch) => {
            const st = statuses[ch.id];
            const imgSt = imageStatuses[ch.id];
            const isActive = editingChannel === ch.id;
            const hasContent = contents[ch.id].length > 0;
            const imgCount = images[ch.id]?.length ?? 0;
            const firstLine = contents[ch.id].split("\n")[0]?.slice(0, 40) ?? "";
            const charCount = contents[ch.id].length;

            return (
              <div
                key={ch.id}
                onClick={() => setEditingChannel(isActive ? null : ch.id)}
                className={cn(
                  "glass-card flex cursor-pointer flex-col overflow-hidden rounded-2xl p-0 transition-all",
                  isActive ? "ring-2 ring-brand shadow-lg" : "hover:shadow-md hover:-translate-y-0.5",
                )}
              >
                {/* Header */}
                <div className={cn(
                  "flex items-center justify-between px-4 py-2.5",
                  isActive ? "bg-brand/5" : "bg-white/60"
                )}>
                  <div className="flex items-center gap-2">
                    <ChannelIcon channelId={ch.id} size={15} />
                    <span className={cn("text-[13px] font-bold", CHANNEL_COLORS[ch.id])}>{ch.name}</span>
                  </div>
                  {st === "generating" && <Loader2 size={13} className="animate-spin text-brand" />}
                  {st === "done" && <CheckCircle2 size={13} className="text-emerald-500" />}
                  {st === "error" && <AlertCircle size={13} className="text-red-400" />}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col justify-center px-4 pb-3">
                  {hasContent ? (
                    <div className="space-y-2.5">
                      {/* 首行摘要 */}
                      <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-700">{firstLine}</p>

                      {/* 配图缩略 */}
                      {imgCount > 0 && (
                        <div className="flex items-center gap-1.5">
                          {images[ch.id].slice(0, 3).map((url, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={i} src={url} alt="" className="h-8 w-8 rounded border border-border/30 object-cover" />
                          ))}
                          {imgCount > 3 && (
                            <span className="text-[9px] text-muted-foreground">+{imgCount - 3}</span>
                          )}
                        </div>
                      )}
                      {imgSt === "generating" && (
                        <div className="flex items-center gap-1 text-[9px] text-purple-400">
                          <Image size={9} /><Loader2 size={9} className="animate-spin" />配图中
                        </div>
                      )}

                      {/* 底部指标 */}
                      <div className="flex items-center justify-between pt-1 border-t border-border/20">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-[9px] tabular-nums font-medium",
                            charCount > CHANNELS[ch.id].maxTextLength ? "text-red-500" : "text-muted-foreground"
                          )}>
                            {charCount}/{CHANNELS[ch.id].maxTextLength}字
                          </span>
                          {imgCount > 0 && (
                            <span className="text-[9px] text-blue-500">{imgCount}张配图</span>
                          )}
                        </div>
                        <span className="flex items-center gap-0.5 text-[9px] font-medium text-brand">
                          <PenLine size={9} />编辑
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-center">
                      {st === "generating" ? (
                        <>
                          <div className="flex gap-1">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand" style={{ animationDelay: "0ms" }} />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand" style={{ animationDelay: "150ms" }} />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand" style={{ animationDelay: "300ms" }} />
                          </div>
                          <span className="text-[10px] text-brand/60">AI 生成中</span>
                        </>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/30">
                          {st === "idle" ? "等待生成" : "生成失败"}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 右侧编辑面板 */}
      {editing && (
        <div className="flex w-[50%] shrink-0 flex-col overflow-hidden animate-fade-in-scale">
          <div className="glass-card flex h-full flex-col overflow-hidden rounded-2xl p-0">
            <div className="flex items-center justify-between border-b border-border/30 bg-white/60 px-5 py-2.5">
              <div className="flex items-center gap-2">
                <ChannelIcon channelId={editing.ch.id} size={15} />
                <span className={cn("text-[13px] font-bold", CHANNEL_COLORS[editing.ch.id])}>{editing.ch.name}</span>
                <span className="rounded bg-muted/60 px-1.5 py-0.5 text-[9px] text-muted-foreground">{editing.ch.toneHint.split("、")[0]}</span>
              </div>
              <button onClick={() => setEditingChannel(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground">
                <X size={15} />
              </button>
            </div>

            <div className="flex-[2] overflow-y-auto border-b border-border/20 bg-gradient-to-b from-slate-50/80 to-slate-100/40 p-4">
              <div className="flex justify-center" style={{ zoom: 0.65 }}>
                <ChannelPreview channelId={editing.ch.id} content={editing.content} image={editing.imgs?.[0]} />
              </div>
            </div>

            <div className="flex-[3] overflow-y-auto bg-white/80 p-4">
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
