import { VectorStore } from "@langchain/core/vectorstores";
import getChromaVectorStore from "@/services/llm/vector-store/chroma-vector-store";
import logger  from "@/logger";
import getPgVectorStore from "@/services/llm/vector-store/pg-vector-store";

let vectorStore: VectorStore;

export default async function getVectorStore() {
    if (!vectorStore) {
        logger.info("Get new vector store");
        if (process.env.VECTOR_STORE === "pgvector") {
            vectorStore = await getPgVectorStore();
        } else {
            vectorStore = await getChromaVectorStore();
        }
    }
    logger.info("Return vector store");
    return vectorStore;
}

