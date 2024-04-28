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
      if (req.query.lastYear) {
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(`${currentYear}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${currentYear}-12-31T23:59:59.999Z`);

        transactions = await TDTransaction.find({
          date: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        }).sort({ date: -1 });
      } else {
        transactions = await TDTransaction.find().sort({ date: -1 });
      }

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
