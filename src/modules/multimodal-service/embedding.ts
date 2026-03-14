import { getMultimodalClient, MODELS } from "./client";
import type { EmbeddingResult, VectorRecord, SemanticSearchResult } from "./types";

export async function embedText(text: string, mediaId?: string): Promise<EmbeddingResult> {
  try {
    const ai = getMultimodalClient();
    const response = await ai.models.embedContent({
      model: MODELS.embedding,
      contents: text,
    });

    const vector = response.embeddings?.[0]?.values ?? [];

    return {
      success: true,
      mediaId: mediaId ?? crypto.randomUUID(),
      vector,
      dimensions: vector.length,
      model: MODELS.embedding,
    };
  } catch (e: unknown) {
    return {
      success: false,
      mediaId: mediaId ?? "",
      vector: [],
      dimensions: 0,
      model: MODELS.embedding,
      error: e instanceof Error ? e.message : "Embedding failed",
    };
  }
}

export async function embedBatch(texts: string[]): Promise<EmbeddingResult[]> {
  try {
    const ai = getMultimodalClient();
    const response = await ai.models.embedContent({
      model: MODELS.embedding,
      contents: texts,
    });

    return (response.embeddings ?? []).map((emb, i) => ({
      success: true,
      mediaId: `batch-${i}`,
      vector: emb.values ?? [],
      dimensions: emb.values?.length ?? 0,
      model: MODELS.embedding,
    }));
  } catch (e: unknown) {
    return texts.map((_, i) => ({
      success: false,
      mediaId: `batch-${i}`,
      vector: [],
      dimensions: 0,
      model: MODELS.embedding,
      error: e instanceof Error ? e.message : "Batch embedding failed",
    }));
  }
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
  minScore = 0.5,
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
  minScore = 0.5,
): Promise<SemanticSearchResult[]> {
  const result = await embedText(query);
  if (!result.success) return [];
  return semanticSearch(result.vector, topK, minScore);
}
