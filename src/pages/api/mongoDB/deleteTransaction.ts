// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
import Transaction from "@/Models/transaction";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "DELETE") {
    const { transactionId } = req.query;
    try {
      const transactions = await Transaction.deleteOne({
        transactionId: transactionId,
      });
      res.status(200).json(`Transaction with id: ${transactionId} deleted`);
    } catch (error) {
      res.status(500).json({ message: "Error deleting transaction" });
    }
  }
}
