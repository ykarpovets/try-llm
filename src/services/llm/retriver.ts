import { createRetrievalChain } from "langchain/chains/retrieval";
import { loadSummarizationChain } from "langchain/chains";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import getVectorStore from "./vector-store";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";
import { getChatModel } from "./model";
import logger from "@/logger";
import { Candidate } from "@/services/db";

const template = `
You are a useful assistant helping to analyse resume of candidate {candidate}.
Provide concise answer based only on the following context:

{context}

Example:
Q: What is the current profession?
A: Software Engineer

Question: {input}
Answer:`;

async function extractDetailsFromCV(query: string, candidate: Candidate) {
  logger.info(`Query "${query}" for candidate ${candidate.name}`);
  const vectorStore = await getVectorStore();
  const retriever = vectorStore.asRetriever({
    filter: { namespace: candidate.cv },
  });
  const llm = getChatModel();
  const prompt = ChatPromptTemplate.fromTemplate(template);
  const combineDocsChain = await createStuffDocumentsChain({ llm, prompt });
  const chain = await createRetrievalChain({ retriever, combineDocsChain });

  const response = await chain.invoke({
    input: query,
    candidate: candidate.name,
  });
  logger.info(`Response: "${JSON.stringify(response)}"`);
  return response?.answer;
}

async function getSummaryForCandidate(candidate: Candidate) {
  logger.info(`Get summary for candidate ${candidate.name}`);
  const vectorStore = await getVectorStore();
  const retriever = vectorStore.asRetriever({
    filter: { namespace: candidate.cv },
  });
  const docs = await retriever.invoke("summary");
  const llm = getChatModel();
  const prompt = new PromptTemplate({
    template: `Summarize the resume of candidate {candidate} based on the following {text}`,
    inputVariables: ["candidate", "text"],
  });
  const chain = loadSummarizationChain(llm, { type: "stuff", prompt });
  const response = await chain.invoke({
    input_documents: docs,
    candidate: candidate.name,
  });
  return response?.text;
}

export { extractDetailsFromCV, getSummaryForCandidate };
