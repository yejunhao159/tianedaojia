export { getMultimodalClient, MODELS } from "./client";

export { detectMediaType, validateFile, createMediaFile, fileToBase64 } from "./upload";

export {
  embedText, embedBatch,
  addToVectorStore, getVectorStore, clearVectorStore,
  semanticSearch, searchByText,
} from "./embedding";

export { extractFromMedia, extractAndEmbed } from "./extract";

export type {
  MediaType, MimeType, MediaFile,
  ExtractionResult, EmbeddingResult,
  SemanticSearchResult, VectorRecord,
} from "./types";
