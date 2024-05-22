import 'server-only';

import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import {OLLAMA_MODEL} from "@/services/llm/constants";

import { ChatOpenAI } from "@langchain/openai";
import {OPENAI_MODEL} from "@/services/llm/constants";
import logger from "@/logger";

function getChatOllamaModel(): BaseChatModel {
    logger.info("use Ollama chat model");
    return new ChatOllama({
        baseUrl: "http://localhost:11434", // Default value
        model: OLLAMA_MODEL,
        temperature: 0.5,
        verbose: true
    });
}

function getChatOpenAIModel(): BaseChatModel {
    logger.info("use OpenAI chat model");
    return new ChatOpenAI({
        model: OPENAI_MODEL,
        apiKey: process.env.OPENAI_API_KEY,
        temperature: 0.5,
        verbose: true
    });
}
export {
    getChatOllamaModel, 
    getChatOpenAIModel,
};