import {
  Chroma,
  ChromaLibArgs,
} from "@langchain/community/vectorstores/chroma";
import { getEmbeddings } from "@/services/llm/model";
import logger from "@/logger";

const chromaConfig: ChromaLibArgs = {
  collectionName: "embeddings",
  url: "http://127.0.0.1:8000",
  collectionMetadata: {
    "hnsw:space": "cosine",
  },
};

export default async function getChromaVectorStore() {
  logger.info("use Chroma vector store");
  const embeddings = getEmbeddings();
  return new Chroma(embeddings, chromaConfig);
}
