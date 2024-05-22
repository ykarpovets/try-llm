import { RetrievalQAChain } from "langchain/chains";
import getVectorStore from "./vector-store";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getChatModel } from "./model";
import logger from "@/logger";
import {Candidate} from "@/services/db";



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
  const llm = getChatModel();
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