"use client";

import { SCENARIOS, TONES } from "@modules/publish-service";
import { cn } from "@/lib/utils";
import { Clock, Home, Baby, Sparkles, Briefcase, Heart, Zap, Wand2, MapPin, DollarSign, Star } from "lucide-react";
import type { ScenarioId, ToneId } from "@/types";
import { useState } from "react";

const SI: Record<string, React.ElementType> = { clock: Clock, home: Home, baby: Baby, sparkles: Sparkles };
const TI: Record<string, React.ElementType> = { briefcase: Briefcase, heart: Heart, zap: Zap };

interface Props {
  requirement: string; scenario: ScenarioId; tone: ToneId; isGenerating: boolean;
  onRequirementChange: (v: string) => void; onScenarioChange: (v: ScenarioId) => void;
  onToneChange: (v: ToneId) => void; onGenerate: () => void;
}

export function RequirementInput({ requirement, scenario, tone, isGenerating, onRequirementChange, onScenarioChange, onToneChange, onGenerate }: Props) {
  const [mode, setMode] = useState<"quick" | "detail">("quick");

  const [position, setPosition] = useState("");
  const [district, setDistrict] = useState("");
  const [salary, setSalary] = useState("");
  const [skills, setSkills] = useState("");
  const [extras, setExtras] = useState("");

  const buildRequirement = () => {
    const parts = [
      position && `岗位：${position}`,
      district && `地区：${district}`,
      salary && `薪资：${salary}`,
      skills && `技能：${skills}`,
      extras && extras,
    ].filter(Boolean);
    return parts.join("，");
  };

  const handleGenerate = () => {
    if (mode === "detail") {
      const built = buildRequirement();
      if (built) onRequirementChange(built);
    }
    onGenerate();
  };

  const cur = SCENARIOS.find((s) => s.id === scenario);

  return (
    <div className="glass-card flex flex-col gap-3 rounded-2xl p-4">
      {/* 模式切换 */}
      <div className="flex items-center gap-1 rounded-lg bg-muted/40 p-0.5">
        {(["quick", "detail"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={cn("flex-1 rounded-md py-1.5 text-[11px] font-medium transition-all",
              mode === m ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}>
            {m === "quick" ? "快速输入" : "结构化输入"}
          </button>
        ))}
      </div>

      {mode === "quick" ? (
        <textarea value={requirement} onChange={(e) => onRequirementChange(e.target.value)}
          placeholder={cur?.sampleRequirement ?? "描述招聘需求..."}
          className="min-h-[80px] resize-none rounded-xl border border-border bg-white px-3 py-2.5 text-[12px] leading-relaxed outline-none transition-colors focus:border-brand/30 focus:ring-2 focus:ring-brand/5 placeholder:text-muted-foreground/40" />
      ) : (
        <div className="space-y-2">
          <SmallField icon={Briefcase} label="岗位" value={position} onChange={setPosition} placeholder="住家保姆" />
          <div className="grid grid-cols-2 gap-2">
            <SmallField icon={MapPin} label="地区" value={district} onChange={setDistrict} placeholder="朝阳区" />
            <SmallField icon={DollarSign} label="薪资" value={salary} onChange={setSalary} placeholder="6000-8000" />
          </div>
          <SmallField icon={Star} label="技能要求" value={skills} onChange={setSkills} placeholder="川菜、照顾老人" />
          <SmallField icon={Sparkles} label="其他" value={extras} onChange={setExtras} placeholder="有健康证，性格开朗" />
        </div>
      )}

      {/* 场景 */}
      <div>
        <p className="mb-1.5 text-[11px] font-semibold text-muted-foreground">场景</p>
        <div className="flex flex-wrap gap-1.5">
          {SCENARIOS.map((s) => { const Icon = SI[s.icon] ?? Sparkles; const a = scenario === s.id; return (
            <button key={s.id} onClick={() => { onScenarioChange(s.id); if (mode === "quick" && !requirement) onRequirementChange(s.sampleRequirement); }}
              className={cn("flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all",
                a ? "bg-brand text-white shadow-sm" : "border border-border bg-white text-muted-foreground hover:border-brand/20")}>
              <Icon size={12} strokeWidth={a ? 2 : 1.5} />{s.name}</button>); })}
        </div>
      </div>

      {/* 语气 */}
      <div>
        <p className="mb-1.5 text-[11px] font-semibold text-muted-foreground">语气</p>
        <div className="flex flex-wrap gap-1.5">
          {TONES.map((t) => { const Icon = TI[t.icon] ?? Briefcase; const a = tone === t.id; return (
            <button key={t.id} onClick={() => onToneChange(t.id)}
              className={cn("flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all",
                a ? "border border-brand/25 bg-brand/5 text-brand" : "border border-border bg-white text-muted-foreground hover:border-brand/20")}>
              <Icon size={12} strokeWidth={a ? 2 : 1.5} />{t.name}</button>); })}
        </div>
      </div>

      <button onClick={handleGenerate}
        disabled={mode === "quick" ? !requirement.trim() || isGenerating : (!position && !district) || isGenerating}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-[12px] font-semibold text-white shadow-sm transition-all hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40">
        {isGenerating ? (
          <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />6 渠道生成中...</>
        ) : (
          <><Wand2 size={14} strokeWidth={2} />AI 一键生成 6 渠道</>
        )}
      </button>
    </div>
  );
}

function SmallField({ icon: Icon, label, value, onChange, placeholder }: {
  icon: typeof Briefcase; label: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
        <Icon size={10} />{label}
      </p>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-lg border border-border/50 bg-white px-2.5 py-1.5 text-[11px] outline-none transition-colors focus:border-brand/30 focus:ring-1 focus:ring-brand/10 placeholder:text-muted-foreground/30" />
    </div>
  );
}
