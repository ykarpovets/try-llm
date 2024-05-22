import { getOllamaEmbeddings, getOpenAIEmbeddings, } from "@/services/llm/model/embeddings";
import { getChatOllamaModel, getChatOpenAIModel } from "@/services/llm/model/model";

const enum LLM_MODEL {
    OPENAI = "OpenAI",
    OLLAMA = "Ollama",
}

const OPENAI_MODEL = "OpenAI";
function getEmbeddings() {
    if (process.env.LLM_MODEL === LLM_MODEL.OPENAI) {
        return getOpenAIEmbeddings();
    }
    return getOllamaEmbeddings();
}

function getChatModel() {
    if (process.env.LLM_MODEL === LLM_MODEL.OPENAI) {
        return getChatOpenAIModel();
    }
    return getChatOllamaModel();
}

export {
    getEmbeddings,
    getChatModel,
};