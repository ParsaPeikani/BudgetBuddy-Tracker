// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";

const openai = new OpenAI({
  organization: process.env.OPENAI_ORGANIZATION_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      // const newMessage = req.body.message;
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a finance advisor and can give tips based on the transactions from the current year.",
          },
        ],
        // stream: true,
        temperature: 0.79,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      // for await (const chunk of response) {
      //   process.stdout.write(chunk.choices[0]?.delta?.content || "");
      // }
      // const stream = OpenAIStream(response);
      // return new StreamingTextResponse(stream);
      res.status(200).json(response);
      res.status(200).json({
        message: `Getting the OPen AI end point to work`,
      });
    } catch (error) {
      res.status(500).json({ message: "Error Deleting Transactions" });
    }
  }
}

// // /pages/api/transactions.js
// import connectDB from "@/pages/lib/connectDB";
// import type { NextApiRequest, NextApiResponse } from "next";
// import OpenAI from "openai";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method === "POST") {
//     try {
//       const openai = new OpenAI({
//         organization: process.env.OPENAI_ORGANIZATION_ID,
//         project: process.env.OPENAI_PROJECT_ID,
//       });
//       const stream = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a finance advisor and can give tips based on the transactions from the current year.",
//           },
//         ],
//         stream: true,
//         temperature: 0.79,
//         max_tokens: 256,
//         top_p: 1,
//         frequency_penalty: 0,
//         presence_penalty: 0,
//       });
//       for await (const chunk of stream) {
//         process.stdout.write(chunk.choices[0]?.delta?.content || "");
//       }
//       //   console.log("this is the response", response);
//       res.status(200).json(stream);
//       res.status(200).json({
//         message: `Getting the OPen AI end point to work`,
//       });
//     } catch (error) {
//       res.status(500).json({ message: "Error Deleting Transactions" });
//     }
//   }
// }
