// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
import CIBCTransaction from "@/Models/cibcTransactions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "GET") {
    try {
      let transactions;

      // Get the current year
      const currentYear = new Date().getFullYear();

      // Find transactions where the year matches the current year
      transactions = await CIBCTransaction.find({
        date: {
          $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
          $lte: new Date(`${currentYear}-12-31T23:59:59Z`),
        },
      }).sort({ date: -1 });
      let CIBCYearlyCategoryData: {
        [key: string]: { amount: number; count: number };
      } = {};

      for (let i = 0; i < transactions.length; i++) {
        const category = transactions[i].category[0];

        // Initialize category if it doesn't exist
        if (!CIBCYearlyCategoryData[category]) {
          CIBCYearlyCategoryData[category] = { amount: 0, count: 0 };
        }

        // Increment amount and count
        CIBCYearlyCategoryData[category].amount += transactions[i].amount;
        CIBCYearlyCategoryData[category].count += 1;
      }

      console.log("this is the CIBCYearlyCategoryData", CIBCYearlyCategoryData);
      const prompt = `you are a finance advisor and can give tips based on the transactions from the current year. The number of user's transactions in the CIBC data is ${
        transactions.length
      }.
      This is each category's data: ${JSON.stringify(
        CIBCYearlyCategoryData
      )} for the year ${currentYear}
      `;
      res.status(200).json({ prompt });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Error fetching transactions" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
