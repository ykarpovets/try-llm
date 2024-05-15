import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import {
  DistanceStrategy,
  PGVectorStore,
} from "@langchain/community/vectorstores/pgvector";
import {OLLAMA_MODEL} from "./constants.ts";

import pool from "../db";

const config = {
  pool: pool,
  tableName: "embeddings",
  collectionTableName: "collections",
  collectionName: "cv",
  columns: {
    idColumnName: "id",
    vectorColumnName: "vector",
    contentColumnName: "content",
    metadataColumnName: "metadata",
  },
  // supported distance strategies: cosine (default), innerProduct, or euclidean
  distanceStrategy: "cosine" as DistanceStrategy,
};

let vectorStore: PGVectorStore;

export default async function getVectorStore() {
  if (!vectorStore) {
    vectorStore = await PGVectorStore.initialize(
      new OllamaEmbeddings({ model: OLLAMA_MODEL }),
      config
    );
  }
  return vectorStore;
}

