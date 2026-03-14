"use client";

import { useMatchStore } from "@/stores/matchStore";
import { CandidateList } from "@/components/match/CandidateList";
import { ScorePanel } from "@/components/match/ScorePanel";
import { WeightSliders } from "@/components/match/WeightSliders";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, Loader2, Search } from "lucide-react";

export default function MatchPage() {
  const {
    requirement, candidates, matching, results, selectedIdx, aiOutput, weights,
    setRequirement, setCandidates, setSelectedIdx, setWeight, loadSample, match,
  } = useMatchStore();

  const selected = results[selectedIdx];

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">智能匹配</h1>
          <p className="text-[13px] text-muted-foreground">加权算法 + LLM 混合匹配，找到最合适的阿姨</p>
        </div>
        <button onClick={match} disabled={!requirement.trim() || matching}
          className="flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40">
          {matching ? <><Loader2 size={16} className="animate-spin" />匹配中...</> : <><Wand2 size={16} />AI 智能匹配</>}
        </button>
      </div>

      {/* Requirement bar */}
      <div className="glass-card flex items-center gap-4 rounded-xl px-5 py-3">
        <Search size={16} className="shrink-0 text-brand" />
        <input value={requirement} onChange={(e) => setRequirement(e.target.value)}
          placeholder="输入招聘需求..."
          className="flex-1 bg-transparent text-[13px] font-medium outline-none placeholder:text-muted-foreground/40" />
        {results.length > 0 && <span className="rounded-full bg-brand/6 px-2.5 py-1 text-[11px] font-semibold text-brand">{results.length} 位候选</span>}
      </div>

      {/* Main content */}
      <div className="grid min-h-0 flex-1 grid-cols-[320px_1fr] gap-4 overflow-hidden">
        {/* Left column: Candidates + input */}
        <div className="flex flex-col gap-4 overflow-y-auto">
          {results.length > 0 ? (
            <CandidateList candidates={results} selectedIdx={selectedIdx} onSelect={setSelectedIdx} />
          ) : (
            <div className="glass-card flex-1 rounded-2xl p-5">
              <h3 className="mb-3 text-[13px] font-semibold">候选人信息</h3>
              <Textarea value={candidates} onChange={(e) => setCandidates(e.target.value)}
                placeholder="粘贴候选阿姨的信息..."
                className="min-h-[200px] resize-none rounded-xl border-border bg-white text-[12px] leading-[1.8] placeholder:text-muted-foreground/40" />
              <button onClick={loadSample} className="mt-2 text-[12px] font-medium text-brand hover:underline">加载示例</button>
            </div>
          )}
          <WeightSliders weights={weights} onChange={setWeight} />
        </div>

        {/* Right column: Score detail */}
        <div className="overflow-y-auto">
          {selected ? (
            <div className="glass-card rounded-2xl p-6">
              <ScorePanel
                name={selected.name}
                totalScore={selected.totalScore}
                dimensions={selected.dimensions}
                recommendation={selected.recommendation}
                advantages={selected.advantages}
                risks={selected.risks}
              />
            </div>
          ) : aiOutput ? (
            <div className="glass-card rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2 text-[13px] font-semibold">
                <Wand2 size={14} className="text-brand" />AI 分析
                {matching && <span className="inline-block h-4 w-0.5 animate-pulse bg-brand" />}
              </div>
              <div className="whitespace-pre-wrap text-[13px] leading-[1.8] text-muted-foreground">{aiOutput}</div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-[13px] text-muted-foreground/40">
              输入需求和候选人后点击「AI 智能匹配」
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
