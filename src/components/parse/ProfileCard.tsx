"use client";

import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, MapPin, Clock, BadgeDollarSign } from "lucide-react";
import type { AuntieProfile } from "@/types";

const SEVERITY_COLORS = {
  low: "bg-amber-50 text-amber-700",
  medium: "bg-orange-50 text-orange-700",
  high: "bg-red-50 text-red-600",
};

export function ProfileCard({ profile }: { profile: AuntieProfile }) {
  const scoreColor = profile.confidenceScore >= 85 ? "text-emerald-600 bg-emerald-50" :
    profile.confidenceScore >= 60 ? "text-amber-600 bg-amber-50" : "text-red-500 bg-red-50";

  return (
    <div className="glass-card space-y-3 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/8 text-sm font-bold text-brand">
            {profile.name.charAt(0)}
          </div>
          <div>
            <p className="text-[14px] font-semibold">{profile.name}</p>
            <p className="text-[12px] text-muted-foreground">{profile.age ?? "?"}岁 · {profile.origin ?? "未知"} · {profile.experience?.years ?? "?"}年经验</p>
          </div>
        </div>
        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", scoreColor)}>
          <Shield size={11} className="mr-1 inline" />置信度 {profile.confidenceScore}%
        </span>
      </div>

      {/* Skills + Certs */}
      <div className="flex flex-wrap gap-1.5">
        {profile.skills.map((s) => (
          <span key={s} className="rounded-md bg-brand/6 px-2 py-0.5 text-[11px] font-medium text-brand">{s}</span>
        ))}
        {profile.certificates.map((c) => (
          <span key={c} className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">{c}</span>
        ))}
      </div>

      {/* Preferences */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-muted-foreground">
        {profile.workPreference?.districts?.length > 0 && (
          <span className="flex items-center gap-1"><MapPin size={12} />{profile.workPreference.districts.join("、")}</span>
        )}
        {profile.workPreference?.timeSlots?.length > 0 && (
          <span className="flex items-center gap-1"><Clock size={12} />{profile.workPreference.timeSlots.join("、")}</span>
        )}
        {profile.workPreference?.salaryRange?.min != null && (
          <span className="flex items-center gap-1">
            <BadgeDollarSign size={12} />¥{profile.workPreference.salaryRange.min.toLocaleString()}-{profile.workPreference.salaryRange.max?.toLocaleString() ?? "?"}/月
          </span>
        )}
      </div>

      {/* Experience highlights */}
      {profile.experience?.highlights?.length > 0 && (
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          {profile.experience.highlights.join("；")}
        </p>
      )}

      {/* Risk flags */}
      {profile.riskFlags?.length > 0 && (
        <div className="space-y-1">
          {profile.riskFlags.map((f, i) => (
            <div key={i} className={cn("flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px]", SEVERITY_COLORS[f.severity])}>
              <AlertTriangle size={12} />{f.field}：{f.issue}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
