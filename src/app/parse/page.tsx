"use client";

import { useParseStore } from "@/stores/parseStore";
import { RawInfoPanel } from "@/components/parse/RawInfoPanel";
import { ProfileCard } from "@/components/parse/ProfileCard";
import { Wand2, Loader2, FileText } from "lucide-react";

export default function ParsePage() {
  const {
    source, rawText, parsing, aiOutput, profiles,
    setSource, setRawText, parse,
  } = useParseStore();

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">信息结构化 + 初筛</h1>
          <p className="text-[13px] text-muted-foreground">将碎片化信息自动解析为结构化阿姨档案</p>
        </div>
        <button onClick={parse} disabled={!rawText.trim() || parsing}
          className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40">
          {parsing ? <><Loader2 size={16} className="animate-spin" />解析中...</> : <><Wand2 size={16} />AI 结构化解析</>}
        </button>
      </div>

      {/* Progress bar */}
      {parsing && (
        <div className="glass-card flex items-center gap-4 rounded-xl px-5 py-3">
          <span className="text-[13px] font-medium text-muted-foreground">批量处理</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-brand/10">
            <div className="h-full animate-pulse rounded-full bg-gradient-to-r from-brand to-orange-400" style={{ width: "60%" }} />
          </div>
          <span className="text-[13px] font-semibold text-brand">分析中...</span>
        </div>
      )}

      {/* Main content */}
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4 overflow-hidden">
        {/* Left: Raw info input */}
        <RawInfoPanel activeSource={source} rawText={rawText} onSourceChange={setSource} onRawTextChange={setRawText} />

        {/* Right: Parsed profiles */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold">结构化档案</h3>
            {profiles.length > 0 && (
              <span className="rounded-full bg-brand/6 px-2.5 py-1 text-[11px] font-semibold text-brand">
                {profiles.length} 份档案
              </span>
            )}
          </div>

          {profiles.length > 0 ? (
            <div className="space-y-3">
              {profiles.map((p) => <ProfileCard key={p.id} profile={p} />)}
            </div>
          ) : aiOutput ? (
            <div className="glass-card flex-1 rounded-2xl p-5">
              <div className="flex items-center gap-2 pb-3">
                <FileText size={15} className="text-brand" />
                <span className="text-[13px] font-semibold">AI 分析输出</span>
                {parsing && <span className="inline-block h-4 w-0.5 animate-pulse bg-brand" />}
              </div>
              <div className="whitespace-pre-wrap text-[13px] leading-[1.8] text-muted-foreground">{aiOutput}</div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-[13px] text-muted-foreground/40">
              粘贴原始信息后点击「AI 结构化解析」
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
