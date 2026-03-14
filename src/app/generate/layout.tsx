"use client";

import { useGenerateStore } from "@/stores/generateStore";
import { useRecruitStore } from "@/stores/recruitStore";
import { RequirementInput } from "@/components/generate/RequirementInput";
import { BatchPublishTable } from "@/components/generate/BatchPublishTable";
import { CHANNEL_IDS } from "@modules/publish-service";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  const {
    requirement, scenario, tone, isGenerating,
    statuses, contents, images,
    setRequirement, setScenario, setTone, batchGenerate,
  } = useGenerateStore();

  const { addTask } = useRecruitStore();
  const router = useRouter();
  const hasSavedRef = useRef(false);

  const allDone = CHANNEL_IDS.every((ch) => statuses[ch] === "done" || statuses[ch] === "error");
  const anyContent = CHANNEL_IDS.some((ch) => contents[ch].length > 0);

  if (allDone && anyContent && !hasSavedRef.current && !isGenerating) {
    hasSavedRef.current = true;

    const channelsRecord = Object.fromEntries(
      CHANNEL_IDS.map((ch) => [
        ch,
        {
          channelId: ch,
          text: contents[ch],
          imageUrl: images[ch]?.[0],
          status: contents[ch].length > 0 ? ("ready" as const) : ("failed" as const),
        },
      ])
    ) as Record<typeof CHANNEL_IDS[number], { channelId: typeof CHANNEL_IDS[number]; text: string; imageUrl?: string; status: "ready" | "failed" }>;

    addTask({
      title: requirement.slice(0, 30) || "新招募任务",
      requirement,
      scenario,
      tone,
      channels: channelsRecord,
    });
  }

  if (!isGenerating && !anyContent) {
    hasSavedRef.current = false;
  }

  const handleGenerate = () => {
    hasSavedRef.current = false;
    batchGenerate();
  };

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col gap-4">
      <div className="flex min-h-0 flex-1 gap-4">
        <div className="flex min-w-0 flex-[3] flex-col gap-3 overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto pt-2">
            {children}
          </div>
        </div>

        <div className="w-[320px] shrink-0 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-lg font-bold tracking-tight">招募文案生成</h1>
              <p className="text-[12px] text-muted-foreground">输入需求，AI 为每个渠道生成适配文案</p>
            </div>
            <RequirementInput
              requirement={requirement}
              scenario={scenario}
              tone={tone}
              isGenerating={isGenerating}
              onRequirementChange={setRequirement}
              onScenarioChange={setScenario}
              onToneChange={setTone}
              onGenerate={handleGenerate}
            />
            {allDone && anyContent && (
              <button
                onClick={() => router.push("/")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand/20 bg-brand/5 py-2.5 text-[13px] font-semibold text-brand transition-all hover:bg-brand/10 active:scale-[0.98]"
              >
                已保存到招募中心，点击查看
              </button>
            )}
          </div>
        </div>
      </div>

      <BatchPublishTable contents={contents} statuses={statuses} images={images} />
    </div>
  );
}
