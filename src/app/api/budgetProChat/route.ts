import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText } from "ai";

export async function POST(req: Request) {
  console.log("hello from the openAI end point1");
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // Call the language model
  const result = await streamText({
    model: openai("gpt-4-turbo"),
    messages,
  });

  // Respond with the stream
  return new StreamingTextResponse(result.toAIStream());
}
