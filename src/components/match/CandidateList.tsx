"use client";

import { cn } from "@/lib/utils";
import { Trophy, User } from "lucide-react";

export interface CandidateItem {
  name: string;
  totalScore: number;
  recommendation: string;
  advantages: string[];
}

interface Props {
  candidates: CandidateItem[];
  selectedIdx: number;
  onSelect: (i: number) => void;
}

export function CandidateList({ candidates, selectedIdx, onSelect }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-[15px] font-bold">候选人列表</h3>
      {candidates.map((c, i) => {
        const active = selectedIdx === i;
        const isTop = i === 0;
        return (
          <button key={i} onClick={() => onSelect(i)}
            className={cn("flex items-center gap-3 rounded-xl p-3.5 text-left transition-all",
              active ? "glass-card border-brand/20 shadow-sm" : "hover:bg-muted/40",
            )}>
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              isTop ? "bg-brand text-white" : "bg-muted text-muted-foreground")}>
              {isTop ? <Trophy size={16} /> : <User size={16} />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold">{c.name}</span>
                {isTop && <span className="rounded bg-brand/8 px-1.5 py-0.5 text-[10px] font-bold text-brand">Top 1</span>}
              </div>
              <p className="truncate text-[11px] text-muted-foreground">
                匹配度 {c.totalScore}% · {c.advantages[0] || ""}
              </p>
            </div>
            <span className={cn("text-[15px] font-bold tabular-nums", isTop ? "text-brand" : "text-foreground")}>
              {c.totalScore}
            </span>
          </button>
        );
      })}
    </div>
  );
}
