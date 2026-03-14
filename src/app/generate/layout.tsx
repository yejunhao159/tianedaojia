"use client";

import { useGenerateStore } from "@/stores/generateStore";
import { RequirementInput } from "@/components/generate/RequirementInput";
import { BatchPublishTable } from "@/components/generate/BatchPublishTable";

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  const {
    requirement, scenario, tone, isGenerating,
    statuses, contents, images,
    setRequirement, setScenario, setTone, batchGenerate,
  } = useGenerateStore();

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
              onGenerate={batchGenerate}
            />
          </div>
        </div>
      </div>

      <BatchPublishTable contents={contents} statuses={statuses} images={images} />
    </div>
  );
}
