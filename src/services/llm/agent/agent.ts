import { z } from "zod";
import {DynamicStructuredTool, type DynamicStructuredToolInput } from "@langchain/core/tools";
import type {BaseRetrieverInterface} from "@langchain/core/retrievers";
import {CallbackManagerForToolRun} from "@langchain/core/callbacks/manager";
import getVectorStore from "@/services/llm/vector-store";
import {FunctionalTranslator, SelfQueryRetriever} from "langchain/retrievers/self_query";
import {getChatModel} from "@/services/llm/model";
import {ChatPromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import {AgentExecutor, createToolCallingAgent} from "langchain/agents";
import {ChromaTranslator} from "@langchain/community/structured_query/chroma";
import {DocumentInterface} from "@langchain/core/documents";

const schema = z.object({
  query: z.string().describe("query to look up in retriever"),
});

const AGENT_SYSTEM_TEMPLATE = `You are an assistant to discuss resumes of candidates 
and be able to suggest the most appropriate candidates for the team to work on the project 
based on the project's description and requirements provided in the query. For simple questions provide simple answers.
For complex questions provide detailed answers.
In case you dont know the answer just say you dont know.`;

type DocMd = {
  candidate: string;
  filename: string;
};

function formatDocs(docs: DocumentInterface<DocMd>[]){
  const reduced = docs.reduce<Record<string, DocumentInterface<DocMd>[]>>((acc, doc) => {
    if (acc[doc.metadata.candidate]) {
      acc[doc.metadata.candidate].push(doc);
    } else {
      acc[doc.metadata.candidate] = [doc];
    }
    return acc;
  }, {});
  
  return Object.entries(reduced).map(([candidate, docs]) => ({
    candidate,
    content: docs.map(doc => doc.pageContent).join("\n"),
  })).map(({ candidate, content }) => `Candidate name: ${candidate}\nResume content: ${content}`)
      .join("\n\n");
}

function createRetrieverTool(retriever: BaseRetrieverInterface<DocMd>, input: Omit<DynamicStructuredToolInput, "func" | "schema">) {
  const func = async ({ query }: z.infer<typeof schema>, runManager?: CallbackManagerForToolRun) => {
    const docs = await retriever.getRelevantDocuments(query, runManager?.getChild("retriever"));
    return formatDocs(docs);
  };
  return new DynamicStructuredTool({ ...input, func, schema });
}

async function agentFactory() {
  /**
   * Get the chat model and the retriever.
   */
  const vectorStore = await getVectorStore();
  const retriever = SelfQueryRetriever.fromLLM({
    llm: getChatModel(0),
    vectorStore,
    documentContents: "Resume of the candidate",
    attributeInfo: [
      { name: "candidate", type: "string", description: "The name of the candidate" },
      { name: "filename", type: "string", description: "The name of the resume file" },
    ],
    structuredQueryTranslator: new ChromaTranslator(),
  });

  /**
   * Wrap the retriever in a tool to present it to the agent in a
   * usable form.
   */
  const tool = createRetrieverTool(retriever as unknown as BaseRetrieverInterface<DocMd>, {
    name: "search_candidates_resumes",
    description: "Searches the relevant information in the resume about candidate technical skills and work experience.",
  });

  /**
   * Based on https://smith.langchain.com/hub/hwchase17/openai-functions-agent
   *
   * This default prompt for the OpenAI functions agent has a placeholder
   * where chat messages get inserted as "chat_history".
   *
   * You can customize this prompt yourself!
   */
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", AGENT_SYSTEM_TEMPLATE],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);

  const chatModel = getChatModel();

  const agent = createToolCallingAgent({
    llm: chatModel,
    tools: [tool],
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools: [tool],
    // Set this if you want to receive all intermediate steps in the output of .invoke().
    returnIntermediateSteps: false, // has no effect with streaming
  });

  return agentExecutor;
}

export default agentFactory;