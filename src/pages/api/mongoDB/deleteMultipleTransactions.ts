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
    const deletedTransactionsWithIndex = req.body;
    try {
      let fullDeletedTransactionData = [];
      // First store all the transaction in an array to send to the client for undo
      for (let i = 0; i < deletedTransactionsWithIndex.length; i++) {
        const transactionId = deletedTransactionsWithIndex[i].transaction.id;
        const transaction = await Transaction.findOne({
          transactionId: transactionId,
        });
        fullDeletedTransactionData.push(transaction);
      }
      // Respond with the deleted transaction data
      for (let i = 0; i < deletedTransactionsWithIndex.length; i++) {
        const transactionId = deletedTransactionsWithIndex[i].transaction.id;
        console.log("This is the transactionId", transactionId);
        await Transaction.deleteOne({ transactionId: transactionId });
      }
      res.status(200).json({
        message: `Transactions Deleted Successfully`,
        fullDeletedTransactionData,
      });
    } catch (error) {
      res.status(500).json({ message: "Error Deleting Transactions" });
    }
  }
}
