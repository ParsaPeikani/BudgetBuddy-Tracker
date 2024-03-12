// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
import Transaction from "@/Models/transaction";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "GET") {
    console.log("I amg etting there");
    const { transactionId } = req.query;
    try {
      const transactions = await Transaction.findOne({
        transactionId: transactionId,
      });
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
