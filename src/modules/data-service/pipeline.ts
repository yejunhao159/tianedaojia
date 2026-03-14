import type { RawDataInput, CleanedRecord, CleaningStep } from "./types";
import { getParser } from "./parsers";
import { DEFAULT_PIPELINE } from "./cleaners";

export interface PipelineResult {
  records: CleanedRecord[];
  stats: {
    inputCount: number;
    outputCount: number;
    droppedCount: number;
    avgConfidence: number;
    stepsApplied: string[];
  };
}

export function runPipeline(
  input: RawDataInput,
  customSteps?: CleaningStep[],
): PipelineResult {
  const parser = getParser(input.source);
  let records = parser(input);
  const inputCount = records.length;

  const steps = customSteps ?? DEFAULT_PIPELINE;
  const stepsApplied: string[] = [];

  for (const step of steps) {
    records = step.execute(records);
    stepsApplied.push(step.name);
  }

  const avgConfidence = records.length > 0
    ? records.reduce((sum, r) => sum + r.confidence, 0) / records.length
    : 0;

  return {
    records,
    stats: {
      inputCount,
      outputCount: records.length,
      droppedCount: inputCount - records.length,
      avgConfidence: Math.round(avgConfidence * 100) / 100,
      stepsApplied,
    },
  };
}
