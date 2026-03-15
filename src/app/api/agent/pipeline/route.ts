import { initFromTextService, runPipeline, CONTENT_GENERATION_PIPELINE, AGENTS } from "@modules/agent-server";
import { withErrorHandler } from "@/lib/api/withErrorHandler";
import { z } from "zod/v4";

initFromTextService();

const schema = z.object({
  requirement: z.string().min(1, "需求不能为空"),
  agents: z.array(z.string()).optional(),
});

export const POST = withErrorHandler(
  async (req: Request) => {
    const body = await req.json();
    const { requirement, agents: agentIds } = schema.parse(body);

    let steps = CONTENT_GENERATION_PIPELINE;
    if (agentIds && agentIds.length > 0) {
      steps = agentIds
        .map((id) => CONTENT_GENERATION_PIPELINE.find((s) => s.agent.id === id))
        .filter(Boolean) as typeof steps;
    }

    const result = await runPipeline(steps, requirement);

    return Response.json({
      success: result.success,
      finalOutput: result.finalOutput,
      steps: result.steps.map((s) => ({
        agentId: s.agentId,
        agentName: AGENTS[s.agentId]?.name ?? s.agentId,
        success: s.success,
        output: s.output,
        durationMs: s.durationMs,
      })),
      totalDurationMs: result.totalDurationMs,
    });
  },
  { route: "/api/agent/pipeline", model: "agent-pipeline" }
);

export async function GET() {
  return Response.json({
    agents: Object.values(AGENTS).map((a) => ({
      id: a.id,
      name: a.name,
      role: a.role,
      temperature: a.temperature,
    })),
    pipeline: CONTENT_GENERATION_PIPELINE.map((s) => s.agent.id),
  });
}
