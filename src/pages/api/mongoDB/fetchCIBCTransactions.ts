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
    try {
      // Convert the query string parameter to a boolean
      const setToLastYear = req.query.latestYear === "true";

      let transactions;

      if (setToLastYear) {
        // Get the current year
        const currentYear = new Date().getFullYear();

        // Find transactions where the year matches the current year
        transactions = await Transaction.find({
          date: {
            $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59Z`),
          },
        }).sort({ date: -1 });
      } else {
        // Fetch all transactions if setToLastYear is not true
        transactions = await Transaction.find({}).sort({ date: -1 });
      }

      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Error fetching transactions" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
