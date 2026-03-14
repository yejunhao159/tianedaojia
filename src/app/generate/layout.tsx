"use client";

import { useGenerateStore } from "@/stores/generateStore";
import { useRecruitStore } from "@/stores/recruitStore";
import { RequirementInput } from "@/components/generate/RequirementInput";
import { CHANNEL_IDS } from "@modules/publish-service";
import { useRouter } from "next/navigation";
import { Save, Image, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GenerateLayout({ children }: { children: React.ReactNode }) {
  const {
    requirement, scenario, tone, isGenerating, isGeneratingImages,
    statuses, contents, images, imageStatuses,
    setRequirement, setScenario, setTone, batchGenerate,
  } = useGenerateStore();

  const { addTask } = useRecruitStore();
  const router = useRouter();

  const allTextDone = CHANNEL_IDS.every((ch) => statuses[ch] === "done" || statuses[ch] === "error");
  const anyContent = CHANNEL_IDS.some((ch) => contents[ch].length > 0);
  const showSave = allTextDone && anyContent && !isGenerating;

  const imagesDoneCount = CHANNEL_IDS.filter((ch) => imageStatuses[ch] === "done").length;
  const imagesTotal = CHANNEL_IDS.filter((ch) => contents[ch].length > 0).length;

  const handleSave = () => {
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
    ) as Record<typeof CHANNEL_IDS[number], {
      channelId: typeof CHANNEL_IDS[number];
      text: string;
      imageUrl?: string;
      status: "ready" | "failed";
    }>;

    addTask({
      title: requirement.slice(0, 30) || "新招募任务",
      requirement,
      scenario,
      tone,
      channels: channelsRecord,
    });
    router.push("/");
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
              onGenerate={batchGenerate}
            />

            {isGeneratingImages && (
              <div className="flex items-center gap-2 rounded-xl border border-purple-100 bg-purple-50/50 px-4 py-3 text-[12px]">
                <Image size={14} className="text-purple-500" />
                <span className="text-purple-700">
                  配图生成中 {imagesDoneCount}/{imagesTotal}
                </span>
                <Loader2 size={12} className="ml-auto animate-spin text-purple-400" />
              </div>
            )}

            {showSave && (
              <button
                onClick={handleSave}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold transition-all active:scale-[0.98]",
                  "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm"
                )}
              >
                <Save size={15} />
                确认保存到招募中心
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
