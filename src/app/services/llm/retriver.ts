import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { RunnableSequence, RunnablePassthrough } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import getVectorStore from "./vector-store";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {OLLAMA_MODEL} from "./constants.ts";

const model = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default value
  model: OLLAMA_MODEL,
  temperature: 0.5
});

const template = `You are a useful assistant in the analysis of resumes.
Provide concise answer based only on the following context:

{context}

Example:
Q: What is the current profession?
A: Software Engineer

Question: {question}
Answer:`;

const prompt = ChatPromptTemplate.fromTemplate(template);

async function extractDetailsFromCV(query: string, cv: string) {
  console.log(`Query "${query}" from CV ${cv}`);
  const vectorStore = await getVectorStore();
  const chain = RunnableSequence.from([
    {
      context: async (input, options) => {
        if (!options?.config || !options.config.configurable) {
          throw new Error("No config");
        }
        const { configurable } = options.config;
        return JSON.stringify(
            await vectorStore.asRetriever(configurable).getRelevantDocuments(input)
        );
      },
      question: new RunnablePassthrough(),
    },
    prompt,
    model,
    new StringOutputParser(),
  ]);
  
  const response = await chain.invoke(query, { configurable: { filter: { name: cv } } });
  console.log(`Answer: "${response}" for CV ${cv}`);
  return response;
}

async function getSummaryForCandidate() {
  return "response";
}

export {
  extractDetailsFromCV,
  getSummaryForCandidate
};