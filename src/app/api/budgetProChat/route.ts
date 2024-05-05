import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText } from "ai";
import { Prompt } from "@/components/apiConstants/apiConstants";
import { Data } from "@/components/apiConstants/apiConstants";

export async function POST(req: Request) {
  console.log("hello from the openAI end point1");
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  console.log("these are the messages", messages);
  if (messages.length === 1) {
    messages.push({
      role: "user",
      content: Prompt,
    }, 
    {
      role: "user",
      content: Data,
    });
  }

  // Call the language model
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages,
  });

  // Respond with the stream
  return new StreamingTextResponse(result.toAIStream());
}
