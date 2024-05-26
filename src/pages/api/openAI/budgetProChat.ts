import OpenAI from "openai";

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

function convertLinefeedsAndBoldToHTML(text: any) {
  // Convert line breaks to <br>
  let convertedText = text.content.replace(/\n/g, "</br>");
  // Convert **bold** to <strong>bold</strong>
  convertedText = convertedText.replace(
    /\*\*(.*?)\*\*/g,
    "<strong>$1</strong>"
  );
  return convertedText;
}

export default async function handler(req: any, res: any) {
  try {
    // Extract the `messages` from the body of the request
    const { messages } = req.body;

    const openAIresponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const response = openAIresponse.choices[0].message;
    response.content = convertLinefeedsAndBoldToHTML(response);

    res.status(200).json(response);
  } catch (error) {
    console.error("Error Getting OpenAI response:", error);
    res.status(500).json({ error: "Error getting OpenAI response" });
  }
}
