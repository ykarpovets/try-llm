import getVectorStore from "@/services/llm/vector-store";
import {SelfQueryRetriever} from "langchain/retrievers/self_query";
import {ChromaTranslator} from "@langchain/community/structured_query/chroma";
import {ChatPromptTemplate, PromptTemplate, MessagesPlaceholder} from "@langchain/core/prompts";
import {createHistoryAwareRetriever} from "langchain/chains/history_aware_retriever";
import {createStuffDocumentsChain} from "langchain/chains/combine_documents";
import {createRetrievalChain} from "langchain/chains/retrieval";
import {getChatModel, getSimpleModel} from "@/services/llm/model";

async function chatFactory() {
  const vectorStore = await getVectorStore();

  const retriever = SelfQueryRetriever.fromLLM({
    llm: getChatModel(0),
    vectorStore,
    documentContents: "Resume of candidate",
    attributeInfo: [
      { name: "candidate", type: "string", description: "The name of the candidate" },
      { name: "filename", type: "string", description: "The name of the resume file" },
    ],
    structuredQueryTranslator: new ChromaTranslator(),
  });

// Contextualize question
  const contextualizeQSystemPrompt = `
    Given a chat history and the latest user question
    which might reference context in the chat history,
    formulate a standalone question which can be understood
    without the chat history. Do NOT answer the question, just
    reformulate it if needed and otherwise return it as is.`;

  const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
    ["system", contextualizeQSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);
  const historyAwareRetriever = await createHistoryAwareRetriever({
    llm: getChatModel(),
    retriever,
    rephrasePrompt: contextualizeQPrompt,
  });

// Answer question
  const qaSystemPrompt = `
    You are an assistant for question-answering tasks. Use
    the following pieces of retrieved context to answer the
    question. If you don't know the answer, just say that you
    don't know. Use three sentences maximum and keep the answer
    concise.
    \n\n
    {context}`;

  const qaPrompt = ChatPromptTemplate.fromMessages([
    ["system", qaSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
  ]);

  const llm = getChatModel(0.5, true);

  // Below we use createStuffDocuments_chain to feed all retrieved context into the LLM. 
  const questionAnswerChain = await createStuffDocumentsChain({
    llm,
    prompt: qaPrompt,
    documentPrompt: new PromptTemplate({
      inputVariables: ["page_content", "candidate"],
      template: `candidate name: {candidate}, resume content: {page_content}
      ----------------------------------------
      `,
    })
  });

  const ragChain = await createRetrievalChain({
    retriever: historyAwareRetriever,
    combineDocsChain: questionAnswerChain,
  });
  
  return ragChain;
}

export default chatFactory;