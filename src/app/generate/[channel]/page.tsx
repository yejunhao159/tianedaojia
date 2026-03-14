"use client";

import { useGenerateStore } from "@/stores/generateStore";
import { ChannelPreview } from "@/components/generate/ChannelPreview";
import { ContentEditor } from "@/components/generate/ContentEditor";
import { CHANNEL_LIST } from "@/lib/config/channels";
import { ChannelIcon } from "@/components/icons/ChannelIcon";

export default function ChannelPage() {
  const { contents, images, statuses, updateContent } = useGenerateStore();

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4 px-1 snap-x snap-mandatory hide-scrollbar">
      {CHANNEL_LIST.map((ch) => {
        const img = images[ch.id]?.[0];
        const st = statuses[ch.id];

        return (
          <div
            key={ch.id}
            className="glass-card flex w-[380px] shrink-0 snap-center flex-col overflow-hidden rounded-3xl p-0 shadow-lg border-white/60 bg-white/40"
          >
            {/* Channel header */}
            <div className="flex items-center justify-between border-b border-border/40 bg-white/60 px-5 py-3.5 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <ChannelIcon channelId={ch.id} size={18} />
                <span className="text-[14px] font-bold text-slate-800">{ch.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {st === "generating" && (
                  <span className="flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-brand">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
                    生成中
                  </span>
                )}
                {st === "done" && (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    已完成
                  </span>
                )}
              </div>
            </div>

            {/* Content Switcher: Preview & Editor */}
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Preview area */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/80 to-slate-100/40 p-6">
                <div className="flex justify-center transition-transform hover:scale-105" style={{ zoom: 0.85 }}>
                  <ChannelPreview channelId={ch.id} content={contents[ch.id]} image={img} />
                </div>
              </div>
              
              {/* Editor area */}
              <div className="border-t border-border/40 bg-white/80 p-4 backdrop-blur-xl">
                <div className="h-[220px]">
                  <ContentEditor
                    channelId={ch.id}
                    content={contents[ch.id]}
                    status={st}
                    onContentChange={(v: string) => updateContent(ch.id, v)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
