// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
import TDTransaction from "@/Models/tdTransactions";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "GET") {
    try {
      let transactions;

      const TdCheckingID = process.env.NEXT_PUBLIC_TD_CHECKING_ACCOUNT_ID;

      transactions = await TDTransaction.find({ accountId: TdCheckingID }).sort(
        { date: -1 }
      );

      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching TD transactions:", error);
      res.status(500).json({ message: "Error fetching TD transactions" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
