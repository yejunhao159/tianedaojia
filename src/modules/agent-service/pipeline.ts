import { runAgent } from "./agent";
import type { PipelineStep, PipelineContext, PipelineResult } from "./types";

export async function runPipeline(
  steps: PipelineStep[],
  input: string,
  metadata: Record<string, unknown> = {},
): Promise<PipelineResult> {
  const start = Date.now();
  const context: PipelineContext = {
    originalInput: input,
    stepResults: [],
    metadata,
  };

  for (const step of steps) {
    if (step.shouldSkip?.(context)) continue;

    const prevOutput = context.stepResults.at(-1)?.output ?? input;
    const agentInput = step.inputTransform
      ? step.inputTransform(prevOutput, context)
      : prevOutput;

    const result = await runAgent(step.agent, agentInput);
    context.stepResults.push(result);

    if (!result.success) {
      return {
        success: false,
        steps: context.stepResults,
        finalOutput: `Agent "${step.agent.name}" failed: ${result.metadata?.error ?? "unknown"}`,
        totalDurationMs: Date.now() - start,
      };
    }
  }

  return {
    success: true,
    steps: context.stepResults,
    finalOutput: context.stepResults.at(-1)?.output ?? "",
    totalDurationMs: Date.now() - start,
  };
}
