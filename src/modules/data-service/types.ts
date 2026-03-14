export type DataSourceType = "text" | "excel" | "image" | "audio" | "pdf" | "wechat_chat";

export interface RawDataInput {
  source: DataSourceType;
  content: string;
  mimeType?: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
}

export interface CleanedRecord {
  id: string;
  fields: Record<string, unknown>;
  confidence: number;
  source: DataSourceType;
  warnings: string[];
  rawSnippet: string;
}

export interface CleaningPipeline {
  name: string;
  steps: CleaningStep[];
}

export interface CleaningStep {
  id: string;
  name: string;
  type: "normalize" | "deduplicate" | "validate" | "enrich" | "transform";
  execute: (records: CleanedRecord[]) => CleanedRecord[];
}

export interface DataSchema {
  name: string;
  fields: SchemaField[];
}

export interface SchemaField {
  key: string;
  label: string;
  type: "string" | "number" | "boolean" | "array" | "date";
  required: boolean;
  validator?: (value: unknown) => boolean;
}
