"use client";

import { Textarea } from "@/components/ui/textarea";
import { SCENARIOS, TONES } from "@modules/publish-service";
import { cn } from "@/lib/utils";
import { Clock, Home, Baby, Sparkles, Briefcase, Heart, Zap, Wand2 } from "lucide-react";
import type { ScenarioId, ToneId } from "@/types";

const SI: Record<string, React.ElementType> = { clock: Clock, home: Home, baby: Baby, sparkles: Sparkles };
const TI: Record<string, React.ElementType> = { briefcase: Briefcase, heart: Heart, zap: Zap };

interface Props {
  requirement: string; scenario: ScenarioId; tone: ToneId; isGenerating: boolean; isExtracting?: boolean;
  onRequirementChange: (v: string) => void; onScenarioChange: (v: ScenarioId) => void;
  onToneChange: (v: ToneId) => void; onGenerate: () => void;
}

export function RequirementInput({ requirement, scenario, tone, isGenerating, isExtracting, onRequirementChange, onScenarioChange, onToneChange, onGenerate }: Props) {
  const cur = SCENARIOS.find((s) => s.id === scenario);
  return (
    <div className="glass-card flex flex-col gap-5 rounded-2xl p-5">
      <div className="flex flex-col gap-2">
        <label className="text-[13px] font-semibold">需求描述</label>
        <Textarea value={requirement} onChange={(e) => onRequirementChange(e.target.value)}
          placeholder={cur?.sampleRequirement ?? "描述您的招聘需求..."}
          className="min-h-[120px] resize-none rounded-xl border-border bg-white text-[13px] leading-relaxed placeholder:text-muted-foreground/40 focus-visible:ring-brand/20" />
      </div>
      <div className="flex flex-col gap-2.5">
        <label className="text-[13px] font-semibold">场景模板</label>
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((s) => { const Icon = SI[s.icon] ?? Sparkles; const a = scenario === s.id; return (
            <button key={s.id} onClick={() => { onScenarioChange(s.id); if (!requirement) onRequirementChange(s.sampleRequirement); }}
              className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all", a ? "bg-brand text-white shadow-sm" : "border border-border bg-white text-muted-foreground hover:border-brand/20 hover:text-foreground")}>
              <Icon size={14} strokeWidth={a ? 2 : 1.5} />{s.name}</button>); })}
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        <label className="text-[13px] font-semibold">语气风格</label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => { const Icon = TI[t.icon] ?? Briefcase; const a = tone === t.id; return (
            <button key={t.id} onClick={() => onToneChange(t.id)}
              className={cn("flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all", a ? "border border-brand/25 bg-brand/5 text-brand" : "border border-border bg-white text-muted-foreground hover:border-brand/20 hover:text-foreground")}>
              <Icon size={14} strokeWidth={a ? 2 : 1.5} />{t.name}</button>); })}
        </div>
      </div>
      <button onClick={onGenerate} disabled={!requirement.trim() || isGenerating}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40">
        {isExtracting ? (
          <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />🧠 AI 正在提取核心要素...</>
        ) : isGenerating ? (
          <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />正在多渠道生成中...</>
        ) : (
          <><Wand2 size={16} strokeWidth={2} />AI 一键生成全部渠道</>
        )}
      </button>
    </div>
  );
}
