import 'server-only';

import { VectorStore } from "@langchain/core/vectorstores";
import getChromaVectorStore from "@/services/llm/vector-store/chroma-vector-store.ts";
import logger  from "@/logger.ts";

let vectorStore: VectorStore;

export default async function getVectorStore() {
  if (!vectorStore) {
    logger.info("Get new vector store");
    vectorStore = await getChromaVectorStore();
  }
  logger.info("Return vector store");
  return vectorStore;
}

