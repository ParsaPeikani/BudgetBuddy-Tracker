// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
import CIBCTransaction from "@/Models/cibcTransactions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "DELETE") {
    const { transactionId } = req.query;
    try {
      // First, find the transaction to ensure it exists and to fetch its data
      const transaction = await CIBCTransaction.findOne({
        transactionId: transactionId,
      });

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      // Optionally, here you could perform a soft delete instead of a hard delete
      // For now, we'll proceed with deleting it from the database
      await CIBCTransaction.deleteOne({ transactionId: transactionId });

      // Respond with the deleted transaction data
      res.status(200).json({
        message: `Transaction with id: ${transactionId} deleted`,
        transaction,
      });
    } catch (error) {
      res.status(500).json({ message: "Error processing transaction" });
    }
  }
}
