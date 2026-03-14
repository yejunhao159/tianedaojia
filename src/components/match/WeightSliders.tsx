"use client";

import { cn } from "@/lib/utils";
import { Settings2 } from "lucide-react";

interface Props {
  weights: Record<string, number>;
  onChange: (key: string, value: number) => void;
}

const DIMS = [
  { key: "district", label: "区域匹配" },
  { key: "skill", label: "技能匹配" },
  { key: "price", label: "价格匹配" },
  { key: "experience", label: "经验匹配" },
  { key: "time", label: "时间匹配" },
];

export function WeightSliders({ weights, onChange }: Props) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <Settings2 size={15} className="text-muted-foreground" />
        <span className="text-[13px] font-semibold">权重调节</span>
      </div>
      <div className="space-y-3">
        {DIMS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="w-16 text-[12px] font-medium text-muted-foreground">{label}</span>
            <input
              type="range" min={0} max={100} step={5}
              value={(weights[key] || 0.2) * 100}
              onChange={(e) => onChange(key, Number(e.target.value) / 100)}
              className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-brand/10 accent-brand"
            />
            <span className="w-8 text-right text-[12px] font-semibold tabular-nums">{((weights[key] || 0.2) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
