// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
import Transaction from "@/Models/transaction";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "POST") {
    // Assuming the transaction object is sent in the request body
    const transactionData = req.body;

    try {
      // Use the Transaction model to create a new document in the MongoDB database
      const updatedTransaction = await Transaction.findOneAndUpdate(
        { transactionId: transactionData.id },
        {
          merchantName: transactionData.name,
          amount: transactionData.amount,
          date: transactionData.date,
          category: [transactionData.category],
          pending: !transactionData.verified,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      res.status(201).json(updatedTransaction); // Respond with the newly created transaction
    } catch (error) {
      res.status(500).json({ message: "Error updating transaction", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
