import OpenAI from "openai";

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

function convertLinefeedsToHTML(text: any) {
  return text.content.replace(/\n/g, "</br>");
}

export default async function handler(req: any, res: any) {
  try {
    // Extract the `messages` from the body of the request
    const { messages } = req.body;
    console.log("these are the messages: ", messages);

    const openAIresponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const response = openAIresponse.choices[0].message;
    response.content = convertLinefeedsToHTML(response);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error Getting OpenAI response:", error);
    return error;
  }
}
