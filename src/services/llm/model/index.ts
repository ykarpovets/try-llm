import { getOllamaEmbeddings, getOpenAIEmbeddings, } from "@/services/llm/model/embeddings";
import { getChatOllamaModel, getChatOpenAIModel } from "@/services/llm/model/model";

enum LLM_MODEL {
    OPENAI = "OpenAI",
    OLLAMA = "Ollama",
}

function getEmbeddings() {
    if (!process.env.LLM_MODEL) {
        return getOllamaEmbeddings();
    }
    switch (process.env.LLM_MODEL) {
        case LLM_MODEL.OPENAI:
            return getOpenAIEmbeddings();
        case LLM_MODEL.OLLAMA:
            return getOllamaEmbeddings();
        default:
            throw new Error(`Unsupported LLM model: ${process.env.LLM_MODEL}`);
    }
}

function getChatModel() {
    if (!process.env.LLM_MODEL) {
        return getChatOllamaModel();
    }
    switch (process.env.LLM_MODEL) {
        case LLM_MODEL.OPENAI:
            return getChatOpenAIModel();
        case LLM_MODEL.OLLAMA:
            return getChatOllamaModel();
        default:
            throw new Error(`Unsupported LLM model: ${process.env.LLM_MODEL}`);
    }
}

export {
    getEmbeddings,
    getChatModel,
};