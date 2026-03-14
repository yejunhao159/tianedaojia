"use client";

import { cn } from "@/lib/utils";
import { Trophy, Lightbulb, AlertTriangle } from "lucide-react";

interface Dimension { score: number; reason: string }

interface Props {
  name: string;
  totalScore: number;
  dimensions: Record<string, Dimension>;
  recommendation: string;
  advantages: string[];
  risks: string[];
}

const DIM_LABELS: Record<string, string> = {
  district: "区域", skill: "技能", price: "价格", experience: "经验", time: "时间",
};

export function ScorePanel({ name, totalScore, dimensions, recommendation, advantages, risks }: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={18} className="text-brand" />
          <span className="text-[15px] font-bold">AI 推荐 · {name}</span>
        </div>
        <span className="rounded-full bg-brand px-4 py-1.5 text-[13px] font-bold text-white">
          综合得分 {totalScore}
        </span>
      </div>

      {/* Dimension scores */}
      <div className="flex gap-2">
        {Object.entries(dimensions).map(([key, dim]) => (
          <div key={key} className="flex flex-1 flex-col items-center gap-1.5 rounded-xl bg-brand/4 p-3">
            <span className="text-[11px] text-muted-foreground">{DIM_LABELS[key] || key}</span>
            <span className={cn("text-xl font-extrabold tabular-nums", dim.score >= 80 ? "text-brand" : dim.score >= 60 ? "text-amber-600" : "text-muted-foreground")}>
              {dim.score}
            </span>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="rounded-xl bg-muted/40 p-4">
        <div className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold">
          <Lightbulb size={14} className="text-brand" />AI 推荐理由
        </div>
        <p className="text-[13px] leading-[1.8] text-muted-foreground">{recommendation}</p>
      </div>

      {/* Advantages + Risks */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
          <p className="mb-2 text-[12px] font-semibold text-emerald-700">优势</p>
          <ul className="space-y-1">
            {advantages.map((a, i) => (
              <li key={i} className="text-[12px] text-emerald-600">✓ {a}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
          <p className="mb-2 text-[12px] font-semibold text-amber-700">风险点</p>
          <ul className="space-y-1">
            {risks.length > 0 ? risks.map((r, i) => (
              <li key={i} className="flex items-center gap-1 text-[12px] text-amber-600">
                <AlertTriangle size={11} />{r}
              </li>
            )) : <li className="text-[12px] text-amber-500">暂无明显风险</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
