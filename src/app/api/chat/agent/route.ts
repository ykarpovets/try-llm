import { NextRequest, NextResponse } from "next/server";
import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import { AIMessage, ChatMessage, HumanMessage } from "@langchain/core/messages";
import agentFactory from "@/services/llm/agent/agent";

export const dynamic = 'force-dynamic';

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

/**
 * This handler initializes and calls a retrieval agent. It requires an OpenAI
 * Functions model. See the docs for more information:
 *
 * https://js.langchain.com/docs/use_cases/question_answering/conversational_retrieval_agents
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    /**
     * We represent intermediate steps as system messages for display purposes,
     * but don't want them in the chat history.
     */
    const messages = (body.messages ?? []).filter(
        (message: VercelChatMessage) =>
            message.role === "user" || message.role === "assistant",
    );

    const previousMessages = messages
        .slice(0, -1)
        .map(convertVercelMessageToLangChainMessage);
    const currentMessageContent = messages[messages.length - 1].content;
    
    const agent = await agentFactory();
    const stream = await agent.stream({
      input: currentMessageContent,
      chat_history: previousMessages
    })

    return new StreamingTextResponse(stream.pipeThrough(
        new TransformStream({
          transform: async (chunk, controller) => {
            if (chunk.output) {
              controller.enqueue(chunk.output);
            }
          }
        })
    ));
    /*
      const result = await agent.invoke({
        input: currentMessageContent,
        chat_history: previousMessages,
      });
      return new NextResponse(result.output, { status: 200 });
     */
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}