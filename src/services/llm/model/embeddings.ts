import 'server-only';

import { EmbeddingsInterface } from "@langchain/core/embeddings";
import {OllamaEmbeddings} from "@langchain/community/embeddings/ollama";
import { OpenAIEmbeddings } from "@langchain/openai";
import {OLLAMA_MODEL, OPENAI_MODEL, OPENAI_EMBEDDINGS_MODEL} from "@/services/llm/constants";
import logger from "@/logger";

function getOllamaEmbeddings(): EmbeddingsInterface {
    logger.info("use Ollama embeddings");
    return new OllamaEmbeddings({ model: OLLAMA_MODEL });
}

function getOpenAIEmbeddings(): EmbeddingsInterface {
    logger.info("use OpenAI embeddings");
    return new OpenAIEmbeddings({ 
        model: OPENAI_EMBEDDINGS_MODEL,
        apiKey: process.env.OPENAI_API_KEY,
    });
}

export {
    getOllamaEmbeddings, 
    getOpenAIEmbeddings,
};