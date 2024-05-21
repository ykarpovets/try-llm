import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import {
  DistanceStrategy,
  PGVectorStore,
} from "@langchain/community/vectorstores/pgvector";
import {OLLAMA_MODEL} from "../constants.ts";

import pool from "@/services/db";

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



export default async function getPgVectorStore() {
    return await PGVectorStore.initialize(
      new OllamaEmbeddings({ model: OLLAMA_MODEL }),
      config
    );
}

