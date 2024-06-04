import { Message as VercelChatMessage, StreamingTextResponse } from "ai";
import chatFactory from "@/services/llm/chat";
import {AIMessage, ChatMessage, HumanMessage} from "@langchain/core/messages";

export const dynamic = "force-dynamic";

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const body = await req.json();
  const messages = body.messages ?? [];
  const previousMessages = messages.slice(0, -1).map(convertVercelMessageToLangChainMessage);
  const currentMessageContent = messages[messages.length - 1].content;


// Usage:
 const chat = await chatFactory();
  const stream = await chat.stream({
    input: currentMessageContent,
    chat_history: previousMessages
  });
  
  // Respond with the stream
  return new StreamingTextResponse(stream.pipeThrough(
      new TransformStream({
        transform: async (chunk, controller) => {
          if (chunk.answer) {
            controller.enqueue(chunk.answer);
          }
        }
      })
  ));
}
