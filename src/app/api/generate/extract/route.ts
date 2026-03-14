import { extractRecruitmentInfo } from "@/lib/ai/extract";
import type { ScenarioId } from "@/types";

export async function POST(req: Request) {
  const { requirement, scenario } = await req.json() as {
    requirement: string;
    scenario: ScenarioId;
  };

  if (!requirement) {
    return new Response("Missing requirement", { status: 400 });
  }

  try {
    const data = await extractRecruitmentInfo(requirement, scenario ?? "hourly");
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to extract info:", error);
    return new Response("Extraction failed", { status: 500 });
  }
}
