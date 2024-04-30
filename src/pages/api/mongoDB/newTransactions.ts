// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
// import Transaction from "@/Models/transaction";
import CIBCTransaction from "@/Models/cibcTransactions";
import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";

type MonthToNumberMap = {
  [key: string]: number | undefined;
};

const month_to_number: MonthToNumberMap = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const month = req.query?.month;
      const year = Number(req.query.year);
      let startDate: any;

      let monthName: string;
      if (typeof month === "string" && month.length > 0) {
        const newMonth: number = month_to_number[month] || 1;
        startDate = moment([year, newMonth - 1]);
        const endDate = moment(startDate).endOf("month");

        // Construct the query
        const query = {
          date: {
            $gte: startDate.toDate(),
            $lt: endDate.toDate(),
          },
        };
        // Execute the query
        const results = await CIBCTransaction.find(query).sort({ date: -1 });
        res.status(200).json(results);
      } else {
        // MongoDB query to filter transactions by year
        const query = {
          $expr: {
            $eq: [{ $year: "$date" }, year],
          },
        };
        const results = await CIBCTransaction.find(query).sort({ date: -1 });
        res.status(200).json(results);
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
