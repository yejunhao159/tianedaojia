import type { EmbeddingResult, VectorRecord, SemanticSearchResult } from "./types";

const VECTOR_DIM = 128;

function hashToVector(text: string): number[] {
  const vector = new Array(VECTOR_DIM).fill(0);
  const words = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, " ").split(/\s+/).filter(Boolean);

  for (const word of words) {
    for (let i = 0; i < word.length; i++) {
      const code = word.charCodeAt(i);
      const idx = (code * 31 + i * 7) % VECTOR_DIM;
      vector[idx] += 1;
    }
  }

  const norm = Math.sqrt(vector.reduce((s, v) => s + v * v, 0)) || 1;
  return vector.map((v) => v / norm);
}

export async function embedText(text: string, mediaId?: string): Promise<EmbeddingResult> {
  const vector = hashToVector(text);
  return {
    success: true,
    mediaId: mediaId ?? crypto.randomUUID(),
    vector,
    dimensions: VECTOR_DIM,
    model: "local-hash-128d",
  };
}

export async function embedBatch(texts: string[]): Promise<EmbeddingResult[]> {
  return texts.map((text, i) => ({
    success: true,
    mediaId: `batch-${i}`,
    vector: hashToVector(text),
    dimensions: VECTOR_DIM,
    model: "local-hash-128d",
  }));
}

// ==================== 内存向量数据库 ====================

const vectorStore: VectorRecord[] = [];

export function addToVectorStore(record: Omit<VectorRecord, "id" | "createdAt">): VectorRecord {
  const entry: VectorRecord = {
    ...record,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  vectorStore.push(entry);
  return entry;
}

export function getVectorStore(): VectorRecord[] {
  return [...vectorStore];
}

export function clearVectorStore(): void {
  vectorStore.length = 0;
}

export function getVectorStoreSize(): number {
  return vectorStore.length;
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export function semanticSearch(
  queryVector: number[],
  topK = 5,
  minScore = 0.3,
): SemanticSearchResult[] {
  return vectorStore
    .map((record) => ({
      mediaId: record.mediaId,
      score: cosineSimilarity(queryVector, record.vector),
      text: record.text,
      metadata: record.metadata,
    }))
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export async function searchByText(
  query: string,
  topK = 5,
  minScore = 0.3,
): Promise<SemanticSearchResult[]> {
  const result = await embedText(query);
  if (!result.success) return [];
  return semanticSearch(result.vector, topK, minScore);
}

export async function indexAndStore(
  mediaId: string,
  text: string,
  metadata: Record<string, unknown> = {},
): Promise<VectorRecord> {
  const result = await embedText(text, mediaId);
  return addToVectorStore({
    mediaId,
    vector: result.vector,
    text: text.slice(0, 500),
    metadata,
  });
}
