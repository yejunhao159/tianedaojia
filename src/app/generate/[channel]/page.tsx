"use client";

import { useState } from "react";
import { useGenerateStore } from "@/stores/generateStore";
import { ChannelPreview } from "@/components/generate/ChannelPreview";
import { ContentEditor } from "@/components/generate/ContentEditor";
import { CHANNEL_LIST } from "@modules/publish-service";
import { ChannelIcon } from "@/components/icons/ChannelIcon";
import { PenLine, X, Image, CheckCircle2, Loader2 } from "lucide-react";
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
      <div className={cn("flex-1 min-h-0", editing ? "max-w-[55%]" : "")}>
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

            return (
              <div
                key={ch.id}
                onClick={() => setEditingChannel(isActive ? null : ch.id)}
                className={cn(
                  "glass-card flex cursor-pointer flex-col overflow-hidden rounded-2xl p-0 transition-all",
                  isActive ? "ring-2 ring-brand/30 shadow-md" : "hover:shadow-md hover:-translate-y-0.5",
                )}
              >
                <div className="flex items-center justify-between border-b border-border/30 bg-white/60 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <ChannelIcon channelId={ch.id} size={14} />
                    <span className="text-[12px] font-bold">{ch.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {st === "generating" && (
                      <Loader2 size={12} className="animate-spin text-brand" />
                    )}
                    {st === "done" && <CheckCircle2 size={12} className="text-emerald-500" />}
                    {imgSt === "generating" && (
                      <span className="flex items-center gap-0.5 text-[9px] text-purple-500">
                        <Image size={9} />
                      </span>
                    )}
                    {imgCount > 0 && imgSt === "done" && (
                      <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[8px] font-medium text-blue-500">
                        {imgCount}图
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-3">
                  {hasContent ? (
                    <>
                      <p className="line-clamp-4 flex-1 text-[11px] leading-relaxed text-slate-600">
                        {contents[ch.id]}
                      </p>
                      <div className="mt-2 space-y-2">
                        {imgCount > 0 && (
                          <div className="flex gap-1.5">
                            {images[ch.id].slice(0, 3).map((url, i) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img key={i} src={url} alt="" className="h-10 w-10 rounded border border-border/30 object-cover" />
                            ))}
                            {imgCount > 3 && (
                              <span className="flex h-10 w-10 items-center justify-center rounded bg-muted/50 text-[9px] text-muted-foreground">+{imgCount - 3}</span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] tabular-nums text-muted-foreground">
                            {contents[ch.id].length}/{ch.maxTextLength}字
                          </span>
                          <span className="flex items-center gap-0.5 text-[9px] font-medium text-brand">
                            <PenLine size={9} />编辑
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-1 items-center justify-center text-[11px] text-muted-foreground/40">
                      {st === "idle" ? "等待生成" : st === "generating" ? "AI 生成中..." : "生成失败"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editing && (
        <div className="flex w-[45%] shrink-0 flex-col overflow-hidden animate-fade-in-scale">
          <div className="glass-card flex h-full flex-col overflow-hidden rounded-2xl p-0">
            <div className="flex items-center justify-between border-b border-border/30 bg-white/60 px-5 py-2.5">
              <div className="flex items-center gap-2">
                <ChannelIcon channelId={editing.ch.id} size={15} />
                <span className="text-[13px] font-bold">{editing.ch.name} 编辑</span>
              </div>
              <button onClick={() => setEditingChannel(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted/60 hover:text-foreground">
                <X size={15} />
              </button>
            </div>

            <div className="flex-[2] overflow-y-auto border-b border-border/20 bg-gradient-to-b from-slate-50/80 to-slate-100/40 p-4">
              <div className="flex justify-center" style={{ zoom: 0.7 }}>
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
