import pool from "@/services/db";
import {
  DistanceStrategy,
  PGVectorStore,
} from "@langchain/community/vectorstores/pgvector";
import {getEmbeddings} from "@/services/llm/model";
import logger from "@/logger";

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
  logger.info("use PGVectorStore");
  const embeddings = getEmbeddings();
    return await PGVectorStore.initialize(embeddings, config);
}

