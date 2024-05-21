import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { RetrievalQAChain } from "langchain/chains";
//import { StringOutputParser } from "@langchain/core/output_parsers";
import getVectorStore from "./vector-store";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {OLLAMA_MODEL} from "./constants.ts";
import logger from "@/logger.ts";
import {Candidate} from "@/services/db.ts";

const llm = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: OLLAMA_MODEL,
  temperature: 0.5
});

const template = `
You are a useful assistant helping to analyse resume of candidate {candidate}.
Provide concise answer based only on the following context:

{context}

Example:
Q: What is the current profession?
A: Software Engineer

Question: {question}
Answer:`;

const prompt = ChatPromptTemplate.fromTemplate(template);

async function extractDetailsFromCV(query: string, candidate: Candidate) {
  logger.info(`Query "${query}" for candidate ${candidate.name}`);
  const vectorStore = await getVectorStore();
  const retriever = vectorStore.asRetriever({ filter: { namespace: candidate.cv } });

  const chain = RetrievalQAChain.fromLLM(llm, retriever, { prompt });
  
  const response = await chain.call({ query, candidate: candidate.name });
  logger.info(`Response: "${JSON.stringify(response)}"`);
  return response?.text;
}

async function getSummaryForCandidate() {
  return "response";
}

export {
  extractDetailsFromCV,
  getSummaryForCandidate
};