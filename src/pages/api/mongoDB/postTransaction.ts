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
    console.log("this is hte request body data", req.body);
    const transactionData = req.body;

    try {
      // Use the Transaction model to create a new document in the MongoDB database
      const newTransaction = new Transaction(transactionData);
      await newTransaction.save(); // Save the new transaction

      res.status(201).json(newTransaction); // Respond with the newly created transaction
    } catch (error) {
      res.status(500).json({ message: "Error saving transaction", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
