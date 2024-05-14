// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
import CIBCTransaction from "@/Models/cibcTransactions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const webhook = req.body;
      console.log("this is the webhook: ", webhook);
      res.status(200).json({
        message: `Webhook URL is working`,
        webhook,
      });
    } catch (error) {
      res.status(500).json({ message: "Error Deleting Transactions" });
    }
  }
}
