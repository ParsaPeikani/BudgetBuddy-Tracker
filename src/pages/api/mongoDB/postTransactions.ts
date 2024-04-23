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
    console.log("POST request received");
    // Assuming the transaction object is sent in the request body
    // const transactionData = req.body;
    const transactionData = [];
    try {
      for (let i = 0; i < transactionData.length; i++) {
        const newTransaction = new Transaction(transactionData[i]);
        await newTransaction.save();
      }
      // Use the Transaction model to create a new document in the MongoDB database
      // const newTransaction = new Transaction(transactionData[0]);
      // await newTransaction.save(); // Save the new transaction

      res.status(201).json(transactionData); // Respond with the newly created transaction
    } catch (error) {
      res.status(500).json({ message: "Error saving transaction", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
