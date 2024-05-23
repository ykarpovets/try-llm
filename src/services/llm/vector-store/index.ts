import { VectorStore } from "@langchain/core/vectorstores";
import getChromaVectorStore from "@/services/llm/vector-store/chroma-vector-store";
import logger  from "@/logger";
import getPgVectorStore from "@/services/llm/vector-store/pg-vector-store";

let vectorStore: VectorStore;

enum VectorStoreType { 
    PGVECTOR = "PgVector", 
    CHROMA = "Chroma" 
}

export default async function getVectorStore() {
    if (!vectorStore) {
        logger.info("Get new vector store");
        if (!process.env.VECTOR_STORE) {
            vectorStore = await getChromaVectorStore();
        } else {
            switch (process.env.VECTOR_STORE) {
                case VectorStoreType.PGVECTOR:
                    vectorStore = await getPgVectorStore();
                    break;
                case VectorStoreType.CHROMA:
                    vectorStore = await getChromaVectorStore();
                    break;
                default:
                    throw new Error("Invalid vector store type")
            }
        }
    }
    logger.info("Return vector store");
    return vectorStore;
}

