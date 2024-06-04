import {
  getOllamaEmbeddings,
  getOpenAIEmbeddings,
} from "@/services/llm/model/embeddings";
import {
  getChatOllamaModel,
  getChatOpenAIModel,
  getOllamaModel,
  getOpenAIModel,
} from "@/services/llm/model/model";

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

function getChatModel(temperature: number = 0.5, streaming: boolean = false) {
  if (!process.env.LLM_MODEL) {
    return getChatOllamaModel(temperature);
  }
  switch (process.env.LLM_MODEL) {
    case LLM_MODEL.OPENAI:
      return getChatOpenAIModel(temperature, streaming);
    case LLM_MODEL.OLLAMA:
      return getChatOllamaModel(temperature);
    default:
      throw new Error(`Unsupported LLM model: ${process.env.LLM_MODEL}`);
  }
}

function getSimpleModel(temperature: number = 0.5, streaming: boolean = false) {
  if (!process.env.LLM_MODEL) {
    return getOllamaModel(temperature, streaming);
  }
  switch (process.env.LLM_MODEL) {
    case LLM_MODEL.OPENAI:
      return getOpenAIModel(temperature, streaming);
    case LLM_MODEL.OLLAMA:
      return getOllamaModel(temperature, streaming);
    default:
      throw new Error(`Unsupported LLM model: ${process.env.LLM_MODEL}`);
  }
}

export { getEmbeddings, getChatModel, getSimpleModel };
