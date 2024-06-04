import "server-only";

import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { BaseLanguageModel } from "@langchain/core/language_models/base";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { Ollama } from "@langchain/community/llms/ollama";
import { OLLAMA_MODEL } from "@/services/llm/constants";

import { ChatOpenAI, OpenAI } from "@langchain/openai";
import { OPENAI_MODEL } from "@/services/llm/constants";
import logger from "@/logger";

function getChatOllamaModel(temperature: number): BaseChatModel {
  logger.info("use Ollama chat model");
  return new ChatOllama({
    baseUrl: "http://localhost:11434", // Default value
    model: OLLAMA_MODEL,
    temperature,
    verbose: true,
  });
}

function getChatOpenAIModel(temperature: number, streaming:boolean): BaseChatModel {
  logger.info("use OpenAI chat model");
  return new ChatOpenAI({
    model: OPENAI_MODEL,
    apiKey: process.env.OPENAI_API_KEY,
    temperature,
    verbose: true,
    streaming,
  });
}

function getOllamaModel(temperature: number, streaming: boolean = false): BaseLanguageModel {
  logger.info("use Ollama chat model");
  return new Ollama({
    baseUrl: "http://localhost:11434", // Default value
    model: OLLAMA_MODEL,
    temperature,
    streaming,
    verbose: true,
  });
}

function getOpenAIModel(temperature: number, streaming: boolean = false): BaseLanguageModel {
  logger.info("use OpenAI chat model");
  return new OpenAI({
    model: OPENAI_MODEL,
    apiKey: process.env.OPENAI_API_KEY,
    temperature,
    streaming,
    verbose: true,
  });
}

export { getOllamaModel, getChatOllamaModel, getOpenAIModel, getChatOpenAIModel };
