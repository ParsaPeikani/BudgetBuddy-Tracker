// import { openai } from "@ai-sdk/openai";
import OpenAI from "openai";
import { StreamingTextResponse, streamText } from "ai";
import { getPrompt } from "@/components/apiConstants/apiConstants";

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

export async function POST(req: any) {
  // Extract the `messages` from the body of the request
  console.log("we are getting here", req.body);
  // try {
  //   // const Prompt = await getPrompt();
  //   // console.log("this is the prompt", Prompt);
  //   // messages.unshift({
  //   //   role: "system",
  //   //   content: Prompt,
  //   // });
  // } catch (error) {
  //   console.error("Error fetching CIBC data:", error);
  //   // Handle the error gracefully, e.g., show a notification to the user
  // }

  // Call the language model
  // const result = await streamText({
  //   model: openai("gpt-4-turbo"),
  //   messages,
  // });
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  // Respond with the stream
  return completion;
}
