"use client";

import { useMatchStore, type CandidateInfo } from "@/stores/matchStore";
import { CandidateList } from "@/components/match/CandidateList";
import { ScorePanel } from "@/components/match/ScorePanel";
import { WeightSliders } from "@/components/match/WeightSliders";
import { GlassCard } from "@/components/layout/GlassCard";
import { Wand2, Loader2, Plus, X, MapPin, Briefcase, DollarSign, Award, Star, User } from "lucide-react";
import { cn } from "@/lib/utils";

function RequirementPanel() {
  const { requirement, updateRequirement } = useMatchStore();

  return (
    <GlassCard className="space-y-3">
      <h3 className="text-[13px] font-bold">招聘需求</h3>
      <div className="grid grid-cols-2 gap-2.5">
        <Field icon={Briefcase} label="岗位" value={requirement.position}
          onChange={(v) => updateRequirement({ position: v })} />
        <Field icon={MapPin} label="区域" value={requirement.district}
          onChange={(v) => updateRequirement({ district: v })} />
        <Field icon={DollarSign} label="薪资范围" value={requirement.salaryRange}
          onChange={(v) => updateRequirement({ salaryRange: v })} placeholder="如 6000-8000" />
        <Field icon={Star} label="经验要求" value={requirement.experience}
          onChange={(v) => updateRequirement({ experience: v })} placeholder="如 3年以上" />
      </div>
      <div>
        <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">技能要求</p>
        <TagInput
          tags={requirement.skills}
          onChange={(skills) => updateRequirement({ skills })}
          placeholder="输入技能后回车"
        />
      </div>
      <Field icon={Award} label="其他要求" value={requirement.extras}
        onChange={(v) => updateRequirement({ extras: v })} placeholder="如 有健康证" />
    </GlassCard>
  );
}

function CandidateCards() {
  const { candidates, removeCandidate, loadSample, addCandidate } = useMatchStore();

  const handleAdd = () => {
    addCandidate({
      id: `c-${Date.now()}`,
      name: "", age: 0, origin: "", experience: 0,
      skills: [], salary: "", district: "", certificates: [],
    });
  };

  return (
    <GlassCard className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-bold">候选人档案 <span className="ml-1 text-[11px] font-normal text-muted-foreground">({candidates.length}人)</span></h3>
        <div className="flex items-center gap-2">
          <button onClick={loadSample} className="text-[11px] font-medium text-brand hover:underline">加载示例</button>
          <button onClick={handleAdd} className="flex items-center gap-1 rounded-lg bg-brand/8 px-2 py-1 text-[11px] font-medium text-brand hover:bg-brand/12">
            <Plus size={12} />添加
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {candidates.map((c) => (
          <CandidateCard key={c.id} candidate={c} onRemove={() => removeCandidate(c.id)} />
        ))}
        {candidates.length === 0 && (
          <p className="py-8 text-center text-[12px] text-muted-foreground/50">暂无候选人，点击「添加」或「加载示例」</p>
        )}
      </div>
    </GlassCard>
  );
}

function CandidateCard({ candidate: c, onRemove }: { candidate: CandidateInfo; onRemove: () => void }) {
  const { updateCandidate } = useMatchStore();
  const update = (patch: Partial<CandidateInfo>) => updateCandidate(c.id, patch);

  return (
    <div className="group relative rounded-xl border border-border/40 bg-white/60 p-3 transition-all hover:border-brand/20 hover:shadow-sm">
      <button onClick={onRemove} className="absolute top-2 right-2 rounded-md p-1 text-muted-foreground/40 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
        <X size={12} />
      </button>
      <div className="grid grid-cols-4 gap-2">
        <MiniField label="姓名" value={c.name} onChange={(v) => update({ name: v })} />
        <MiniField label="年龄" value={c.age ? String(c.age) : ""} onChange={(v) => update({ age: Number(v) || 0 })} />
        <MiniField label="籍贯" value={c.origin} onChange={(v) => update({ origin: v })} />
        <MiniField label="经验(年)" value={c.experience ? String(c.experience) : ""} onChange={(v) => update({ experience: Number(v) || 0 })} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <MiniField label="期望薪资" value={c.salary} onChange={(v) => update({ salary: v })} />
        <MiniField label="服务区域" value={c.district} onChange={(v) => update({ district: v })} />
      </div>
      <div className="mt-2">
        <p className="mb-1 text-[9px] font-medium text-muted-foreground/60">技能</p>
        <TagInput tags={c.skills} onChange={(skills) => update({ skills })} placeholder="添加技能" small />
      </div>
      {c.certificates.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {c.certificates.map((cert) => (
            <span key={cert} className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600">{cert}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, placeholder }: {
  icon: typeof Briefcase; label: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
        <Icon size={10} />{label}
      </p>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder ?? label}
        className="w-full rounded-lg border border-border/50 bg-white/80 px-2.5 py-1.5 text-[12px] outline-none transition-colors focus:border-brand/30 focus:ring-1 focus:ring-brand/10 placeholder:text-muted-foreground/30" />
    </div>
  );
}

function MiniField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="mb-0.5 text-[9px] font-medium text-muted-foreground/60">{label}</p>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={label}
        className="w-full rounded-md border border-border/30 bg-white/60 px-2 py-1 text-[11px] outline-none focus:border-brand/30 placeholder:text-muted-foreground/20" />
    </div>
  );
}

function TagInput({ tags, onChange, placeholder, small }: {
  tags: string[]; onChange: (tags: string[]) => void; placeholder?: string; small?: boolean;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault();
      onChange([...tags, e.currentTarget.value.trim()]);
      e.currentTarget.value = "";
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-1 rounded-lg border border-border/50 bg-white/80 px-2 py-1.5", small && "py-1")}>
      {tags.map((tag, i) => (
        <span key={i} className={cn("inline-flex items-center gap-0.5 rounded-full bg-brand/8 px-2 py-0.5 font-medium text-brand", small ? "text-[9px]" : "text-[10px]")}>
          {tag}
          <button onClick={() => onChange(tags.filter((_, j) => j !== i))} className="ml-0.5 hover:text-red-500">
            <X size={small ? 8 : 10} />
          </button>
        </span>
      ))}
      <input onKeyDown={handleKeyDown} placeholder={tags.length === 0 ? placeholder : ""}
        className={cn("min-w-[60px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground/30", small ? "text-[10px]" : "text-[11px]")} />
    </div>
  );
}

export default function MatchPage() {
  const { matching, results, selectedIdx, aiOutput, weights, setSelectedIdx, setWeight, match } = useMatchStore();
  const selected = results[selectedIdx];

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">智能匹配</h1>
          <p className="text-[13px] text-muted-foreground">结构化录入需求和候选人，AI 多维度评分推荐</p>
        </div>
        <button onClick={match} disabled={matching}
          className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40">
          {matching ? <><Loader2 size={16} className="animate-spin" />匹配中...</> : <><Wand2 size={16} />AI 智能匹配</>}
        </button>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[380px_1fr] gap-4 overflow-hidden">
        <div className="flex flex-col gap-3 overflow-y-auto hide-scrollbar">
          <RequirementPanel />
          <CandidateCards />
          <WeightSliders weights={weights} onChange={setWeight} />
        </div>

        <div className="overflow-y-auto">
          {selected ? (
            <GlassCard className="space-y-4">
              <ScorePanel
                name={selected.name}
                totalScore={selected.totalScore}
                dimensions={selected.dimensions}
                recommendation={selected.recommendation}
                advantages={selected.advantages}
                risks={selected.risks}
              />
            </GlassCard>
          ) : results.length > 0 ? (
            <CandidateList candidates={results} selectedIdx={selectedIdx} onSelect={setSelectedIdx} />
          ) : aiOutput ? (
            <GlassCard>
              <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold">
                <Wand2 size={14} className="text-brand" />AI 分析
                {matching && <span className="inline-block h-4 w-0.5 animate-pulse bg-brand" />}
              </div>
              <div className="whitespace-pre-wrap text-[13px] leading-[1.8] text-muted-foreground">{aiOutput}</div>
            </GlassCard>
          ) : (
            <div className="flex h-full items-center justify-center text-[13px] text-muted-foreground/40">
              填写左侧需求和候选人后，点击「AI 智能匹配」
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
